// Firestore + Google sign-in for Recipe Repo.
// Exposes the same small database interface the app already uses
// (collection().onSnapshot, collection().doc().set/delete, doc().set/onSnapshot),
// so the rest of the app doesn't care where the data lives.
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

// Firestore error codes mapped onto the codes the app already handles.
const toAppError = (e) => ({
  code: e?.code === "permission-denied" ? "denied"
      : e?.code === "resource-exhausted" ? "quota_exceeded"
      : e?.code === "invalid-argument" ? "bad_data"
      : "unavailable",
  message: e?.message || String(e),
});

export async function connect(config) {
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(SDK + "firebase-app.js"),
    import(SDK + "firebase-auth.js"),
    import(SDK + "firebase-firestore.js"),
  ]);

  const app = initializeApp(config);
  const authApi = auth.getAuth(app);

  // Keep a copy of the data on the phone so the app opens and works offline.
  let store;
  try {
    store = fs.initializeFirestore(app, {
      localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }),
    });
  } catch {
    store = fs.getFirestore(app);
  }

  const wrapDoc = (s) => ({ id: s.id, exists: s.exists(), data: () => s.data(), metadata: s.metadata });

  const docRef = (path) => {
    const ref = fs.doc(store, path);
    return {
      id: ref.id,
      path,
      get: async () => wrapDoc(await fs.getDoc(ref)),
      set: (data) => fs.setDoc(ref, data).catch((e) => { throw toAppError(e); }),
      delete: () => fs.deleteDoc(ref).catch((e) => { throw toAppError(e); }),
      onSnapshot: (next, onError) =>
        fs.onSnapshot(ref, (s) => next(wrapDoc(s)), (e) => onError && onError(toAppError(e))),
    };
  };

  const db = {
    doc: docRef,
    collection: (path) => ({
      doc: (id) => docRef(`${path}/${id}`),
      onSnapshot: (next, onError) =>
        fs.onSnapshot(
          fs.collection(store, path),
          (s) => next({
            docs: s.docs.map((d) => ({ id: d.id, exists: true, data: () => d.data() })),
            size: s.size,
            empty: s.empty,
            metadata: s.metadata,
          }),
          (e) => onError && onError(toAppError(e))
        ),
    }),
  };

  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  // Finish a redirect sign-in if one was started on a previous load.
  auth.getRedirectResult(authApi).catch(() => {});

  return {
    db,
    onUser: (fn) => auth.onAuthStateChanged(authApi, fn),
    async signIn() {
      try {
        await auth.signInWithPopup(authApi, provider);
      } catch (e) {
        if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") {
          return auth.signInWithRedirect(authApi, provider);
        }
        if (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") return;
        throw e;
      }
    },
    signOut: () => auth.signOut(authApi),
  };
}
