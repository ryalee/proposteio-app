"use client";

import { useState } from "react";
import {
  PanelsTopLeft,
  Palette,
  MonitorSmartphone,
  ChartNoAxesCombined,
  Video,
  ListFilter,
  ArrowRight,
  ArrowLeft,
  PenLine,
  RotateCw,
  Copy,
  Download,
} from "lucide-react";

type ProjectType =
  | "website"
  | "UI/UX"
  | "app"
  | "marketing"
  | "video"
  | "outro";
type Language = "pt-BR" | "en" | "es";

export default function NovaProposta() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    clientName: "",
    projectType: "" as ProjectType | "",
    language: "pt-BR" as Language,
    challenge: "",
    price: "",
    currency: "BRL",
    duration: "",
    durationUnit: "dias",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState("");

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "success",
  );
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  // funções modal
  const openModal = (
    title: string,
    message: string,
    type: "success" | "error" | "confirm" = "success",
    callback?: () => void,
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalCallback(() => callback || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalCallback && modalType === "confirm") {
      modalCallback();
    }
  };

  const cancelModal = () => {
    setModalOpen(false);
  };

  const projectTypes = [
    {
      type: "website",
      icon: <PanelsTopLeft className="w-5 h-5" />,
      name: "Website, Landing Page",
    },
    { type: "UI/UX", icon: <Palette className="w-5 h-5" />, name: "UI/UX" },
    {
      type: "app",
      icon: <MonitorSmartphone className="w-5 h-5" />,
      name: "Aplicativo, software ou sistema",
    },
    {
      type: "marketing",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
      name: "Marketing Digital",
    },
    {
      type: "video",
      icon: <Video className="w-5 h-5" />,
      name: "Produção de vídeo",
    },
    {
      type: "outro",
      icon: <ListFilter className="w-5 h-5" />,
      name: "Projeto personalizado",
    },
  ];

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: "pt-BR", flag: "🇧🇷", name: "Português" },
    { code: "en", flag: "🇺🇸", name: "Inglês" },
    { code: "es", flag: "🇪🇸", name: "Espanhol" },
  ];

  const projectTypeNames: Record<string, string> = {
    website: "Website",
    "UI/UX": "UI/UX, Identidade Visual",
    app: "Aplicativo",
    marketing: "Marketing Digital",
    video: "Produção de vídeo",
    outro: "Projeto personalizado",
  };

  // validação das etapas
  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.clientName.trim()) {
        openModal(
          "Campo obrigatório",
          "O nome do cliente é essencial para personalizar sua proposta. Por favor, preencha este campo para avançar.",
          "error",
        );
        return false;
      }

      if (!formData.projectType) {
        openModal(
          "Campo obrigatório",
          "Selecionar o tipo de projeto é fundamental para que a IA possa criar uma proposta alinhada às necessidades do cliente. Por favor, escolha uma opção para continuar.",
          "error",
        );
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.challenge.trim()) {
        openModal(
          "Campo obrigatório",
          "Descrever o desafio do cliente é crucial para criar uma proposta que realmente atenda às suas necessidades. Por favor, preencha este campo para avançar.",
          "error",
        );
        return false;
      }

      if (!formData.price.trim()) {
        openModal(
          "Campo obrigatório",
          "Por favor, informe o valor do projeto para que possamos incluir na proposta.",
          "error",
        );
        return false;
      }

      if (!formData.duration) {
        openModal(
          "Campo obrigatório",
          "Por favor, informe a duração do projeto para que possamos incluir na proposta.",
          "error",
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  // gerar proposta
  const generateProposal = async () => {
    if (!validateStep()) return;

    setCurrentStep(3);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/gerar-proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar proposta");
      }

      const data = await response.json();
      setProposal(data.proposal);
    } catch (err) {
      console.error("Erro ao gerar proposta:", err);
      setError("Erro ao gerar proposta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // copiar proposta
  const copyFallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = proposal;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      openModal(
        "Sucesso",
        "Proposta copiada para a área de transferência!",
        "success",
      );
    } catch (err) {
      openModal(
        "Erro",
        "Não foi possível copiar a proposta. Por favor, copie manualmente.",
        "error",
      );
    }

    document.body.removeChild(textarea);
  };

  const copyProposal = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(proposal)
        .then(() =>
          openModal(
            "Sucesso",
            "Proposta copiada para a área de transferência!",
            "success",
          ),
        )
        .catch(() => copyFallback());
    } else {
      copyFallback();
    }
  };

  // gerar outra porposta
  const regenerateProposal = async () => {
    openModal(
      "Confirmar ação",
      "Tem certeza que deseja gerar outra versão da proposta? A versão atual será perdida.",
      "confirm",
      async () => {
        setIsLoading(true);
        setError("");

        try {
          const response = await fetch("/api/gerar-proposta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error("Erro ao regenerar proposta");
          }

          const data = await response.json();
          setProposal(data.proposal);
        } catch (err) {
          console.error("Erro ao regenerar proposta:", err);
          setError("Erro ao regenerar proposta. Por favor, tente novamente.");
        } finally {
          setIsLoading(false);
        }
      },
    );
  };

  // criar nova proposta
  const newProposal = () => {
    openModal(
      "Confirmar ação",
      "Tem certeza que deseja criar uma nova proposta? Todos os dados atuais serão perdidos.",
      "confirm",

      () => {
        setFormData({
          clientName: "",
          projectType: "",
          language: "pt-BR",
          challenge: "",
          price: "",
          currency: "BRL",
          duration: "",
          durationUnit: "dias",
        });
        setProposal("");
        setError("");
        setCurrentStep(1);
      },
    );
  };

  const progress = (currentStep / 3) * 100;

  return (
    <section className="min-h-screen flex items-center justify-center p-5">
      <div className="rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* header */}
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Gere sua proposta</h1>
          <p className="text-sm">
            Complete os campos para gerar sua proposta personalizada
          </p>
        </div>

        {/* barra superior */}
        <div className="h-1.5 bg-blue-600"></div>

        {/* conteudo */}
        <div className="p-10">
          {/* step 1 */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">
                Informações Básicas
              </h2>
              <p className="mb-8 text-sm">
                Vamos começar com os dados principais do projeto.
              </p>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Nome do Cliente{" "}
                  <span className="text-red-600 text-xs">*</span>
                </label>

                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Ex: Maria Silva"
                  className="w-full px-4 py-3 border border-[#888] rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Tipo de Projeto{" "}
                  <span className="text-red-600 text-xs">*</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((project) => (
                    <div
                      key={project.type}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          projectType: project.type as ProjectType,
                        })
                      }
                      className={`p-4 border rounded-xl cursor-pointer transition-all text-center hover:border-indigo-500 hover:bg-gray-50 items-center ${
                        formData.projectType === project.type
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{project.icon}</div>
                        <div className="text-sm font-medium text-gray-700">
                          {project.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block mb-2 font-medium text-sm">
                  Idioma da Proposta{" "}
                  <span className="text-red-600 text-xs">*</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() =>
                        setFormData({ ...formData, language: lang.code })
                      }
                      className={`p-4 border rounded-xl cursor-pointer transition-all text-center hover:border-indigo-500 hover:bg-gray-50 ${
                        formData.language === lang.code
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="text-xs font-medium text-gray-700">
                        {lang.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-[#101970] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Próximo <ArrowRight className="inline-block ml-2" />
              </button>
            </div>
          )}

          {/* step 2 */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Defina o Desafio
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Descreva o problema que seu cliente enfrenta.
              </p>

              <div className="mb-6">
                <label className="flex flex-col mb-2 font-medium text-sm">
                  <p>
                    O que o cliente deseja?{" "}
                    <span className="text-red-600 text-xs">*</span>
                  </p>
                  <span className="text-xs text-gray-500">
                    (use o máximo de detalhes possível. Recomendamos colar o que
                    o ele escreveu no anúncio)
                  </span>{" "}
                </label>

                <textarea
                  value={formData.challenge}
                  onChange={(e) =>
                    setFormData({ ...formData, challenge: e.target.value })
                  }
                  placeholder="Ex: Precisa de um site institucional para apresentar seus serviços e captar leads."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Valor Pretendido{" "}
                  <span className="text-red-600 text-xs">*</span>
                </label>

                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-200 w-24 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  >
                    <option value="BRL">R$</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>

                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Ex: 1000"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block mb-2 font-medium text-sm">
                  Prazo Estimado <span className="text-red-600 text-xs">*</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="Ex: 4"
                    min="1"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all w-[50%]"
                  />

                  <select
                    value={formData.durationUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, durationUnit: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all w-[50%]"
                  >
                    <option value="dias">Dias</option>
                    <option value="semanas">Semanas</option>
                    <option value="meses">Meses</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 text-xs text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  <ArrowLeft className="inline-block text mr-2" /> Voltar
                </button>

                <button
                  onClick={generateProposal}
                  className="flex-1 bg-[#101970] text-xs text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Gerar Proposta com IA
                </button>
              </div>
            </div>
          )}

          {/* step 3 -> proposta é gerada */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">
                    Gerando sua proposta com IA...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Voltar e Tentar Novamente
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Sua proposta está pronta! 🎉
                  </h2>
                  <p className="text-gray-500 mb-8 text-sm">
                    Revise e personalize antes de enviar
                  </p>

                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    rows={15}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-6 text-sm text-gray-700 leading-relaxed resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={regenerateProposal}
                      disabled={isLoading}
                      className="flex items-center justify-center px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50"
                    >
                      <RotateCw className="inline-block mr-2" />
                      Gerar Outra Versão
                    </button>

                    <button
                      onClick={copyProposal}
                      className="flex items-center justify-center px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                    >
                      <Copy className="inline-block mr-2" />
                      Copiar
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      <ArrowLeft className="inline-block mr-2" />
                      Voltar
                    </button>

                    <button
                      onClick={newProposal}
                      className="flex-1 bg-[#101970] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      Nova Proposta
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn">
            <button
              onClick={cancelModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="flex justify-center mb-4">
              {modalType === "success" && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {modalType === "error" && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              {modalType === "confirm" && (
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              {modalTitle}
            </h3>

            <p className="text-gray-600 text-center mb-6">{modalMessage}</p>

            <div className="flex gap-3">
              {modalType === "confirm" ? (
                <>
                  <button
                    onClick={cancelModal}
                    className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  onClick={cancelModal}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in;
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-scaleIn {
            animation: scaleIn 0.3s ease-in;
          }
        `}
      </style>
    </section>
  );
}
