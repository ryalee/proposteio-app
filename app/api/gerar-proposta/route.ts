import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, projectType, challenge, price, currency, duration, durationUnit, language } = body;

    // Ver se os dados chegaram
    console.log('Dados recebidos:', { clientName, projectType, challenge, price, currency, duration, durationUnit, language });

    // Ver se a API key existe
    console.log('api key existe?', !!process.env.GROQ_API_KEY);

    const projectTypeNames: Record<string, string> = {
      website: 'Website',
      'UI/UX': 'UI/UX e Identidade Visual',
      app: 'Aplicativo',
      marketing: 'Marketing Digital',
      video: 'Produção de vídeo',
      outro: 'Projeto personalizado',
    };

    const currencySymbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€';

    const prompt = `Você é um copywriter especialista em propostas comerciais para freelancers.
      Gere uma proposta comercial sintetizada e profissional com um tom amigavel para o cliente ${clientName}.
      Idioma: ${language}. Serviço: ${projectTypeNames[projectType] || projectType}. Desafio: ${challenge}. Valor: ${currencySymbol} ${price}.
      Duração Estimada: ${duration ? `${duration} ${durationUnit}` : 'A combinar'}.
      Tom: profissional mas amigável, persuasivo e acessível. Sem formalidade exagerada e mantendo uma postura de especialista que entende as necessidades do cliente e oferece soluções claras. Evite termos como 'prezado' e coisas assim.

      mantenha uma variação em cada proposta, cada proposta tem que ter um modelo diferente e nãoseguir um "template", não gere sempre a mesma estrutura, tenha um estilo mais criativo sem ser "mais do mesmo".

      máximo de 250 palavras. Seja direto e evite jargões técnicos. O objetivo é convencer o cliente a aceitar a proposta, destacando os benefícios e o valor do serviço oferecido.

      NÃO ESQUEÇA DE GERAR DE ACORDO COM O IDIOMA ${language}. Se o idioma for português, escreva a proposta em português. Se for inglês, escreva em inglês. Se for espanhol, escreva em espanhol.

      Ao clicar em "gerar nova versão", a proposta deve ser completamente diferente, com uma estrutura diferente, mas mantendo as informações essenciais.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    console.log('Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro API Groq:', errorText);
      console.error('Status:', response.status);
      console.error('Headers:', Object.fromEntries(response.headers.entries()));
      
      return NextResponse.json({ 
        error: 'Erro na API Groq', 
        details: errorText,
        status: response.status 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Proposta gerada com sucesso!');
    
    const proposal = data.choices[0].message.content;

    return NextResponse.json({ proposal });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ 
      error: 'Erro ao gerar proposta',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}