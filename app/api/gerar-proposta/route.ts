import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      projectType,
      challenge,
      price,
      currency,
      duration,
      durationUnit,
      language,
    } = body;

    console.log("Dados:", {
      clientName,
      projectType,
      challenge,
      price,
      currency,
      duration,
      durationUnit,
      language,
    });

    const projectTypeNames: Record<string, string> = {
      website: "Website",
      "UI/UX": "UI/UX e Identidade Visual",
      app: "Aplicativo",
      marketing: "Marketing Digital",
      video: "Produção de vídeo",
      outro: "Projeto personalizado",
    };

    const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "$" : "€";

    const prompt = `Você é um copywriter especialista em propostas comerciais para freelancers altamente competitivos. Sua missão é gerar uma proposta persuasiva, estratégica e original para ${clientName}.

    Idioma obrigatório: ${language}.
    Serviço: ${projectTypeNames[projectType] || projectType}.
    Desafio do cliente: ${challenge}.
    Investimento: ${currencySymbol} ${price}.
    Duração estimada: ${duration ? `${duration} ${durationUnit}` : "A combinar"}.

    REGRAS ESTRATÉGICAS:

    - A proposta deve soar 100% escrita manualmente.
    - NUNCA reutilize estruturas previsíveis.
    - A abertura deve variar a cada geração.
    - Varie o ritmo das frases.
    - Evite termos muito formais, como "prezado"
    - Evite frases clichês de marketplace.
    - Demonstre entendimento real do desafio apresentado.
    - Foque nos benefícios e impacto final, não apenas nas tarefas.
    - Não use jargões técnicos desnecessários.
    - Não use markdown.
    - Máximo 210 palavras.

    ESTRUTURA OBRIGATÓRIA (mas com liberdade criativa na forma de apresentar):

    1. Saudação personalizada baseado nas necessidades enviadas pelo cliente.
    2. A proposta DEVE ser num tom humano e natural.
    3. O que será entregue (em formato de lista simples, sem símbolos).
    4. Breve menção a experiência ou portfólio relevante.
    5. Cronograma ou expectativa de execução.
    6. Encerramento estratégico que incentive resposta.

    IMPORTANTE:
    Ao gerar uma nova versão, altere:
    - A forma de abertura
    - A sequência argumentativa
    - O estilo de persuasão (ex: consultivo, direto, estratégico, orientado a resultado)
    - O fluxo da narrativa

    Nunca repita padrão estrutural de proposta anterior.

    Escreva obrigatoriamente no idioma ${language} selecionado.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      },
    );

    console.log("Status da resposta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Erro API Groq:", errorText);
      console.error("Status:", response.status);
      console.error("Headers:", Object.fromEntries(response.headers.entries()));

      return NextResponse.json(
        {
          error: "Erro na API Groq",
          details: errorText,
          status: response.status,
        },
        { status: 500 },
      );
    }

    const data = await response.json();

    console.log("Proposta gerada com sucesso!");

    const proposal = data.choices[0].message.content;

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      {
        error: "Erro ao gerar proposta",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
