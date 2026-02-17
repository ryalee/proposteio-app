import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, projectType, challenge, price, currency, duration, durationUnit, language, projectName } = body;

    const prompt = `Você é um copywriter especialista em propostas comerciais para freelancers.
      CONTEXTO:
      - Cliente: ${clientName}
      - Projeto: ${projectName}
      - Desafio: ${challenge}
      - Valor: ${price} ${currency}
      - Duração: ${duration} ${durationUnit}

      INSTRUÇÕES:
      1. Tom profissional, persuasivo e acessível.
      2. Foque nos BENEFICIOS para o cliente.
      3. Use técnicas de copywriting persuasivo.
      4. Inclua social proof se possível.
      5. Crie senso de urgência sutil.
      6. Idioma da proposta ${language}.

      ESTRUTURA OBRIGATÓRIA:
      1. Abertura impactante (2-3 linhas)
      2. Entendimento do problema/desafio (1 parágrafo)
      3. Solução proposta detalhada (2-3 parágrafos)
      4. Diferenciais competitivos (bullet points)
      5. Investimento e ROI esperado
      6. Prazo e cronograma
      7. Próximos passos claros
      8. Call-to-action forte

      FORMATO:
      - Parágrafos curtos
      - Linguagem clara
      - Sem jargões técnicos desnecessários
      - Máximo 600 palavras
    `;

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const proposal = data.choices[0].message.content;

    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao gerar proposta' }, { status: 500 });
  }
}