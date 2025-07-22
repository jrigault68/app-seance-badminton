import React, { useState, useEffect } from "react";

export default function ProgrammeForm({
  initialValues = {},
  onSubmit,
  niveaux = [],
  categories = [],
  types = [],
  mode = "create", // "create" ou "edit"
  loading = false,
  error = null,
  onCancel
}) {
  // Fonction utilitaire pour normaliser les valeurs null en ""
  function normalizeFormValues(values) {
    return {
      ...values,
      nom: values.nom ?? "",
      description: values.description ?? "",
      objectif: values.objectif ?? "",
      image_url: values.image_url ?? "",
      date_debut: values.date_debut ?? "",
      date_fin: values.date_fin ?? "",
      niveau_id: values.niveau_id ?? "",
      categorie_id: values.categorie_id ?? "",
      type_id: values.type_id ?? "",
      nb_jours: values.nb_jours ?? 1,
      type_programme: values.type_programme ?? "libre",
    };
  }

  const [form, setForm] = useState(() => normalizeFormValues({
    type_programme: "libre",
    nom: "",
    description: "",
    niveau_id: "",
    categorie_id: "",
    type_id: "",
    nb_jours: 1,
    objectif: "",
    image_url: "",
    date_debut: "",
    date_fin: "",
    est_actif: true,
    ...initialValues,
  }));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setForm(f => normalizeFormValues({
      ...f,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    if (form.type_programme === "calendaire") {
      if (!form.date_debut || !form.date_fin) {
        setFormError("Les dates de début et de fin sont obligatoires pour un programme calendaire.");
        return;
      }
      if (form.date_debut > form.date_fin) {
        setFormError("La date de début doit être antérieure à la date de fin.");
        return;
      }
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/40 rounded-2xl p-6 border border-gray-700 space-y-6">
      {error && <div className="text-red-400 text-center mb-2">{error}</div>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type de programme</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="type_programme"
              value="libre"
              checked={form.type_programme === "libre"}
              onChange={handleChange}
              className="form-radio text-orange-500"
            />
            <span className="ml-2">Libre (nombre de jours, sans dates fixes)</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="type_programme"
              value="calendaire"
              checked={form.type_programme === "calendaire"}
              onChange={handleChange}
              className="form-radio text-orange-500"
            />
            <span className="ml-2">Calendaire (dates fixes)</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nom *</label>
        <input
          type="text"
          name="nom"
          value={form.nom || ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
          placeholder="Nom du programme"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
          placeholder="Description du programme"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Objectif</label>
        <input
          type="text"
          name="objectif"
          value={form.objectif || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
          placeholder="Objectif du programme"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Niveau</label>
          <select
            name="niveau_id"
            value={form.niveau_id || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
          >
            <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
            {niveaux.map(n => (
              <option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            name="categorie_id"
            value={form.categorie_id || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
          >
            <option value="" className="bg-gray-700 text-gray-400">Sélectionner une catégorie</option>
            {categories.map(c => (
              <option key={c.id} value={c.id} className="bg-gray-700 text-white">{c.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type_id"
            value={form.type_id || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
          >
            <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
            {types.map(t => (
              <option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>
            ))}
          </select>
        </div>
        {form.type_programme === "libre" && (
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de jours</label>
            <input
              type="number"
              name="nb_jours"
              value={form.nb_jours ?? 1}
              min={1}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
            />
          </div>
        )}
        {form.type_programme === "calendaire" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input
                type="date"
                name="date_debut"
                value={form.date_debut || ""}
                onChange={handleChange}
                style={{colorScheme: 'dark'}}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <input
                type="date"
                name="date_fin"
                value={form.date_fin || ""}
                onChange={handleChange}
                style={{colorScheme: 'dark'}}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
            </div>
          </>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image (URL)</label>
        <input
          type="text"
          name="image_url"
          value={form.image_url || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
          placeholder="URL de l'image"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="est_actif"
          checked={!!form.est_actif}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <label className="text-sm font-medium">Activer le programme</label>
      </div>
      {/* Message d'erreur du formulaire déplacé juste avant les boutons */}
      {formError && <div className="text-red-400 text-center mb-4">{formError}</div>}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          disabled={loading}
        >
          {mode === "edit" ? "Enregistrer" : "Créer le programme"}
        </button>
      </div>
    </form>
  );
} 