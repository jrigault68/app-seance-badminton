import { useUser } from "../contexts/UserContext";
import Layout from "../components/Layout";

export default function Profil() {
  const { user } = useUser();

  if (!user) return null; // Ce cas n’arrive plus normalement avec PrivateRoute

  return (
    <Layout pageTitle="Profil">
      <div className="w-full flex justify-center px-2 sm:px-4 md:px-12">
        <div className="bg-black/40 border border-gray-700 rounded-2xl shadow-lg w-full max-w-none mx-auto p-4 sm:p-4 md:p-6 xl:px-8 xl:py-6" style={{maxWidth: '700px', marginTop: '2rem'}}>
          <h2 className="text-2xl font-bold mb-2 text-rose-400">Mon profil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span className="text-gray-400">Nom :</span>
              <span className="text-white ml-2">{user.nom}</span>
            </div>
            <div>
              <span className="text-gray-400">Email :</span>
              <span className="text-white ml-2">{user.email}</span>
            </div>
          </div>
          <div className="flex flex-col items-center mt-8">
            <span className="text-4xl">👋</span>
            <span className="text-lg text-gray-300 mt-2">Bienvenue sur votre espace personnel !</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
