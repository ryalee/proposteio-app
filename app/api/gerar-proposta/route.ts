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

    const projectTypeNames: Record<string, string> = {
      website: "Website",
      "UI/UX": "UI/UX e Identidade Visual",
      app: "Aplicativo",
      marketing: "Marketing Digital",
      video: "Produção de vídeo",
      outro: "Projeto personalizado",
    };

    const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "$" : "€";

    const prompt = `Você é um especialista em propostas comerciais para freelancers em marketplaces competitivos como 99Freelas, Workana e Fiverr.

    Seu objetivo principal é gerar uma proposta que aumente as chances de resposta do cliente e transmissão de confiança profissional.

    A proposta deve parecer escrita manualmente, de forma natural e específica para o projeto.

    Idioma obrigatório: ${language}

    Nome do cliente: ${clientName}
    Serviço solicitado: ${projectTypeNames[projectType] || projectType}
    Desafio do cliente: ${challenge}
    Investimento proposto: ${currencySymbol} ${price}
    Prazo estimado: ${duration ? `${duration} ${durationUnit}` : "A combinar"}

    CONTEXTO IMPORTANTE:

    * O cliente provavelmente recebeu diversas propostas.
    * O texto deve ser fácil e rápido de escanear.
    * A proposta deve transmitir clareza, entendimento do problema e redução de risco.
    * Evite excesso de persuasão, marketing exagerado ou linguagem artificial.

    DIRETRIZES:

    * Demonstre entendimento genuíno do desafio apresentado.
    * Foque no impacto e benefício final para o cliente.
    * Mostre segurança e organização sem parecer robótico.
    * Evite frases genéricas típicas de marketplaces.
    * Evite exageros e promessas irreais.
    * Evite jargões técnicos e formalidade desnecessários.
    * Use tom humano, direto e profissional.
    * Varie introduções e transições naturalmente sem comprometer clareza.
    * Evite repetir estruturas mecanicamente entre gerações.
    * Priorize clareza acima de criatividade.
    * Máximo de 150 palavras.
    * Não utilize markdown.

    A proposta deve conter:

    1. Abertura contextualizada ao problema do cliente sem repetir o que o mesmo ja falou.
    2. Demonstração breve de entendimento estratégico/técnico.
    3. O que será entregue.
    4. Encerramento leve incentivando resposta.
  `;

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
