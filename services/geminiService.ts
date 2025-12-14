import { GoogleGenAI } from "@google/genai";
import { MOCK_PROVIDER } from "../constants";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

export const generateChatResponse = async (
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const client = getAI();
  if (!process.env.API_KEY) {
    return "Desculpe, estou offline no momento (Falta API Key).";
  }

  const serviceList = MOCK_PROVIDER.services
    .map(s => `- ${s.name} (${s.duration} min, R$ ${s.price}): ${s.description}`)
    .join('\n');

  const professionals = MOCK_PROVIDER.professionals
    .map(p => `- ${p.name} (${p.role})`)
    .join('\n');

  const policies = MOCK_PROVIDER.policies?.join('\n- ') || "Regras padrão aplicadas.";
  
  const loyaltyInfo = MOCK_PROVIDER.loyaltyProgram?.enabled
    ? `PROGRAMA DE FIDELIDADE: Oferecemos ${MOCK_PROVIDER.loyaltyProgram.rewardDescription} a cada ${MOCK_PROVIDER.loyaltyProgram.threshold} visitas.`
    : "Sem programa de fidelidade ativo no momento.";

  const systemInstruction = `Você é o Recepcionista Virtual da ${MOCK_PROVIDER.name}.
  Seu objetivo é ajudar clientes a escolher serviços, entender as regras e tirar dúvidas.
  
  Informações do Negócio:
  - Nome: ${MOCK_PROVIDER.name}
  - Localização: ${MOCK_PROVIDER.location}
  - Avaliação: ${MOCK_PROVIDER.rating}/5 estrelas
  
  Profissionais:
  ${professionals}

  Serviços Disponíveis:
  ${serviceList}
  
  Regras:
  - ${policies}
  
  ${loyaltyInfo}
  
  Diretrizes:
  - Seja breve, amigável e prestativo (fale em Português).
  - Se perguntarem sobre profissionais, liste quem trabalha aqui.
  - Recomende serviços com base no que o cliente quer.
  - Não invente horários; diga apenas que você pode verificar a agenda.
  - Use emojis ocasionalmente.
  - Se perguntarem como agendar, encoraje-os a selecionar os serviços e clicar em "Continuar".
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Estou com dificuldade para pensar agora.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, estou com problemas de conexão.";
  }
};