(function() {
    const scenarios = {
        salao: {
            name: "Studio Elegance Hair",
            avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop&crop=face",
            messages: [
                { type: 'sent', text: 'Olá! Gostaria de marcar um corte e barba para amanhã.', delay: 800 },
                { type: 'received', text: 'Olá! Bem-vindo ao Studio Elegance! 💈 Sou a assistente virtual. Temos vagas amanhã com o Lucas às 14:00 ou 16:30. Qual prefere?', delay: 1500, typingTime: 1200 },
                { type: 'sent', text: '16:30 fica perfeito!', delay: 1400 },
                { type: 'received', text: 'Excelente! Pode me confirmar seu nome para agendar?', delay: 1400, typingTime: 900 },
                { type: 'sent', text: 'Gleison Andrade.', delay: 1200 },
                { type: 'received', text: '✅ Agendamento concluído!\n📅 Amanhã às 16:30\n✂️ Corte & Barba (Lucas)\nTe enviaremos um lembrete 2h antes!', delay: 1600, typingTime: 1400 }
            ]
        },
        clinica: {
            name: "Clínica Integrada Saúde",
            avatar: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop&crop=face",
            messages: [
                { type: 'sent', text: 'Boa tarde! Vocês têm horário para consulta com Dermatologista esta semana?', delay: 800 },
                { type: 'received', text: 'Olá! Sim! 🩺 Temos horários com a Dra. Camila na quinta-feira às 10:00 ou sexta-feira às 15:30. Seria convênio ou particular?', delay: 1600, typingTime: 1300 },
                { type: 'sent', text: 'Convênio Bradesco Saúde.', delay: 1400 },
                { type: 'received', text: 'Perfeito, atendemos sim! Deseja reservar a quinta-feira às 10:00?', delay: 1300, typingTime: 900 },
                { type: 'sent', text: 'Sim, pode reservar por favor.', delay: 1100 },
                { type: 'received', text: '📋 Pré-agendamento reservado!\nEnviamos o link para envio da sua carteirinha e pedido médico. Obrigado!', delay: 1600, typingTime: 1300 }
            ]
        },
        petshop: {
            name: "PetCare Veterinária & Banho",
            avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop&crop=face",
            messages: [
                { type: 'sent', text: 'Oi, tem vaga para banho e tosa hoje à tarde para um Golden?', delay: 800 },
                { type: 'received', text: 'Oi! 🐾 Temos encaixe hoje às 15:00 com serviço de busca Táxi Dog ou entrega presencial. Qual prefere?', delay: 1500, typingTime: 1200 },
                { type: 'sent', text: 'Vou levar pessoalmente às 15:00.', delay: 1300 },
                { type: 'received', text: 'Combinado! Qual é o nome do seu pet para preparar a ficha?', delay: 1200, typingTime: 800 },
                { type: 'sent', text: 'Thor.', delay: 1000 },
                { type: 'received', text: '🐶 Vaga do Thor garantida para hoje às 15:00! Te aguardamos aqui!', delay: 1500, typingTime: 1100 }
            ]
        },
        farmacia: {
            name: "FarmaPopular Delivery",
            avatar: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop&crop=face",
            messages: [
                { type: 'sent', text: 'Olá, vocês entregam aqui no Centro? Preciso de Dipirona gotas e protetor solar FPS 50.', delay: 800 },
                { type: 'received', text: 'Olá! Entregamos sim em até 40 minutos com taxa grátis para o Centro! 🛵\n\n• Dipirona Gotas 500mg: R$ 8,90\n• Protetor FPS 50 Antioleosidade: R$ 49,90\nTotal: R$ 58,80.', delay: 1700, typingTime: 1400 },
                { type: 'sent', text: 'Pode mandar! Vou pagar no Pix.', delay: 1300 },
                { type: 'received', text: 'Chave Pix Copia e Cola gerada! Assim que transferir seu pedido já sai para rota: [PIX-KEY-COPIA-COLA]', delay: 1600, typingTime: 1200 }
            ]
        },
        comercio: {
            name: "Loja & Variedades Express",
            avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=face",
            messages: [
                { type: 'sent', text: 'Boa tarde, o fone bluetooth que vi no Instagram ainda tem a pronta entrega?', delay: 800 },
                { type: 'received', text: 'Boa tarde! 🎧 Temos sim nas cores Preto e Branco Fosco com garantia de 6 meses. Deseja retirar hoje ou envio por motoboy?', delay: 1600, typingTime: 1300 },
                { type: 'sent', text: 'Quero o Preto para envio!', delay: 1300 },
                { type: 'received', text: 'Ótima escolha! Me informe seu CEP para calcularmos a entrega expressa.', delay: 1300, typingTime: 900 }
            ]
        }
    };

    const chatContainer = document.getElementById('chat-messages');
    const botName = document.getElementById('bot-name');
    const botAvatar = document.getElementById('bot-avatar');
    const deviceTime = document.querySelector('.device-time');
    const scenarioButtons = document.querySelectorAll('.btn-scenario');

    let currentScenario = 'salao';
    let timeoutHandles = [];
    let typingElement = null;

    if (!chatContainer) return;

    function updateTime() {
        if (typeof moment !== 'undefined' && deviceTime) {
            deviceTime.innerText = moment().format('HH:mm');
        }
    }
    updateTime();

    function clearScheduledTimeouts() {
        timeoutHandles.forEach(h => clearTimeout(h));
        timeoutHandles = [];
        if (typingElement) {
            typingElement.remove();
            typingElement = null;
        }
    }

    function showTyping() {
        if (typingElement) return;
        typingElement = document.createElement('div');
        typingElement.className = 'typing-bubble';
        typingElement.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        chatContainer.appendChild(typingElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function removeTyping() {
        if (typingElement) {
            typingElement.remove();
            typingElement = null;
        }
    }

    function renderMessage(item) {
        removeTyping();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + item.type;

        const timeString = typeof moment !== 'undefined' ? moment().format('HH:mm') : '14:32';
        const checkIcon = item.type === 'sent' 
            ? `<span class="tick"><svg viewBox="0 0 16 15"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>` 
            : '';

        msgDiv.innerHTML = item.text.replace(/\n/g, '<br>') + 
            `<span class="metadata"><span class="time">${timeString}</span>${checkIcon}</span>`;

        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function runScenario(key) {
        clearScheduledTimeouts();
        chatContainer.innerHTML = '';

        const data = scenarios[key];
        if (!data) return;

        botName.innerText = data.name;
        botAvatar.src = data.avatar;

        let accumulatedDelay = 300;

        data.messages.forEach(msg => {
            accumulatedDelay += msg.delay;

            if (msg.type === 'received' && msg.typingTime) {
                const typingHandle = setTimeout(() => {
                    showTyping();
                }, accumulatedDelay);
                timeoutHandles.push(typingHandle);
                accumulatedDelay += msg.typingTime;
            }

            const msgHandle = setTimeout(() => {
                renderMessage(msg);
            }, accumulatedDelay);
            timeoutHandles.push(msgHandle);
        });

        // Loop automático após 6 segundos
        const loopHandle = setTimeout(() => {
            runScenario(currentScenario);
        }, accumulatedDelay + 6000);
        timeoutHandles.push(loopHandle);
    }

    // Configura os botões de troca de segmento
    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const scenario = this.getAttribute('data-scenario');
            if (scenario === currentScenario) return;

            scenarioButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentScenario = scenario;
            runScenario(currentScenario);
        });
    });

    runScenario(currentScenario);
})();