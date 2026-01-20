const Game = {
    init: () => {
        State.userUid = getOrSetUid();
        const storedName = localStorage.getItem('bp_player_name');
        if (storedName) State.playerName = storedName;
        Renderer.renderLobby();
    },

    create: async () => {
        const name = document.getElementById('create-name').value;
        const difficulty = document.getElementById('difficulty-select').value; // Corrigido typo 'dificuty'
        const observer = document.getElementById("observer").checked;
        
        if (!name) return showToast("Erro", "Digite seu nome", "destructive");
        
        State.playerName = name;
        localStorage.setItem('bp_player_name', name);
        State.isCreator = true;

        // --- NOVA LÓGICA: DEFINIR STATUS INICIAIS ---
        let initialStats = {};
        if (difficulty === 'hard') {
            // Modo Crise: Tudo 3, Fome 0
            initialStats = { economy: 3, education: 3, wellbeing: 3, popular_support: 3, military_religion: 3, hunger: 0 };
        } else {
            // Modo Normal: Tudo 6, Fome 0
            initialStats = { economy: 6, education: 6, wellbeing: 6, popular_support: 6, military_religion: 6, hunger: 0 };
        }
        // --------------------------------------------

        try {
            State.ui.isProcessing = true;
            Renderer.updateButtons();
            
            // Enviamos 'initialStats' junto com a dificuldade
            const res = await API.request('/game/create', 'POST', {
                userUid: State.userUid,
                playerName: State.playerName,
                difficulty: difficulty,
                isObserver: observer,
                initialStats: initialStats // O Backend precisa aceitar este campo
            });
            
            if (res.success) {
                State.gameCode = res.gameCode;
                Game.startPolling();
                Renderer.renderWaitingRoom();
            }
        } catch (e) {
            // Toast handled by API wrapper
        } finally {
            State.ui.isProcessing = false;
            Renderer.updateButtons();
        }
    },

    join: async () => {
        const name = document.getElementById('join-name').value;
        const code = document.getElementById('join-code').value.toUpperCase();
        
        if (!name || !code) return showToast("Erro", "Preencha nome e código", "destructive");

        State.playerName = name;
        localStorage.setItem('bp_player_name', name);
        State.isCreator = false;

        try {
            State.ui.isProcessing = true;
            Renderer.updateButtons();

            const res = await API.request('/game/join', 'POST', {
                gameCode: code,
                userUid: State.userUid,
                playerName: State.playerName
            });

            if (res.success) {
                State.gameCode = code;
                Game.startPolling();
                Renderer.renderWaitingRoom();
            }
        } catch (e) {
            // Toast handled
        } finally {
            State.ui.isProcessing = false;
            Renderer.updateButtons();
        }
    },

    startGame: async () => {
        if (State.serverData.players.length > 0){
        try {
            await API.request('/game/start', 'POST', { gameCode: State.gameCode });
            // Polling vai pegar a mudança de status e renderizar o jogo
        } catch (e) {}
    }
    },

    startPolling: () => {
        if (State.pollingInterval) clearInterval(State.pollingInterval);
        
        // Primeira chamada imediata
        Game.fetchState();

        State.pollingInterval = setInterval(async () => {
            await Game.fetchState();
        }, 2000);
    },

    fetchState: async () => {
        try {
            const data = await API.request(`/game/${State.gameCode}`, 'GET');
            
            // Verifica mudança de estado para renderizar a view correta
            const prevStatus = State.serverData.status;
            
            // Mapeia resposta da API para State
            State.serverData = {
                status: data.status,
                players: data.players || [],
                currentCard: data.currentCard,
                logs: data.logs || [],
                difficulty: data.difficulty,
                stats: {
                    economy: data.economy,
                    education: data.education,
                    wellbeing: data.wellbeing,
                    popular_support: data.popular_support,
                    hunger: data.hunger,
                    military_religion: data.military_religion
                },
                board_position: data.board_position,
                current_player_index: data.current_player_index,
                game_over_message: data.game_over_message,
                creator_uid: data.creator_user_uid,
                education_history: data.education_history
            };

            

            // Define se sou criador baseado na resposta do servidor (mais seguro)
            State.isCreator = (State.userUid === data.creator_user_uid);

            // Lógica de navegação de telas
            if (State.serverData.status === 'in_progress' && State.ui.view !== 'game') {
                State.ui.view = 'game';
                Renderer.renderGame();
            } else if (State.serverData.status === 'finished') {
                if (State.pollingInterval) clearInterval(State.pollingInterval);
                Renderer.showEndGame(State.serverData.game_over_message);
            } else if (State.serverData.status === 'waiting' && State.ui.view === 'lobby') {
                // Se por acaso caiu aqui sem passar pelo create/join manual
                    Renderer.renderWaitingRoom();
            }

            if (State.ui.view === 'game') {
                Renderer.updateGameUI();
            } else if (State.ui.view === 'waiting') {
                Renderer.updateWaitingUI();
            }
            
            State_geral = State.serverData
        } catch (e) {
            console.error("Polling error", e);
        }
    },

    makeDecision: async (choiceIndex) => {
        try {
            State.ui.isProcessing = true;
            Renderer.updateGameUI(); // Desabilita botões visualmente

            await API.request('/game/decision', 'POST', {
                gameCode: State.gameCode,
                userUid: State.userUid,
                choice: choiceIndex
            });
            
            // Polling vai atualizar o resto
        } catch (e) {
        } finally {
            State.ui.isProcessing = false;
        }
    },

    restart: async () => {
        try {
            await API.request('/game/restart', 'POST', {
                gameCode: State.gameCode,
                userUid: State.userUid
            });
            document.getElementById('end-game-dialog').classList.add('hidden');
            document.getElementById('end-game-dialog').classList.remove('flex');
            Game.startPolling();
        } catch (e) {}
    },

    setTab: (tab) => {
        State.ui.tab = tab;
        Renderer.updateGameUI();
    }
};
