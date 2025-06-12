import { useUser } from "../contexts/UserContext";

export default function Profil() {
  const { user } = useUser();

  if (!user) return null; // Ce cas n’arrive plus normalement avec PrivateRoute

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white">
      <div className="bg-black/40 p-8 rounded-2xl shadow-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold">Bienvenue, {user.nom} 👋</h2>
        <p className="text-lg text-gray-300">Email : {user.email}</p>
      </div>
    </div>
  );
}
