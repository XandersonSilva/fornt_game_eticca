// console.log(players)
function showPlayerDetails(indice) {
    var players = State.serverData["players"]
    console.log(indice)
    var player = players[indice]
    console.log(player)
    
    const roleConfig = {
        'Ministro': {
            // Gradiente Azul Real e Dourado
            headerGradient: 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500',
            iconBorder: 'border-amber-400',
            accentColor: 'text-amber-400',
            
            // Representação: Cardeal Richelieu
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Richelieu%2C_por_Philippe_de_Champaigne_(detalle).jpg/640px-Richelieu%2C_por_Philippe_de_Champaigne_(detalle).jpg',
        },
        'General': {
            // Verde Militar e Vermelho Sangue
            headerGradient: 'bg-gradient-to-br from-stone-800 via-stone-700 to-red-900',
            iconBorder: 'border-red-600',
            accentColor: 'text-red-500',
            
            // Representação: Napoleão Bonaparte
            imageUrl: 'https://aventurasnahistoria.com.br/wp-content/uploads/personagem/napoelddnnd.jpg',
        },
        'Opositor': {
            // Vermelho Escuro Revolucionário e Preto
            headerGradient: 'bg-gradient-to-br from-red-950 via-red-900 to-red-700',
            iconBorder: 'border-stone-900', 
            accentColor: 'text-red-500',
            
            // Representação: Guy Fawkes
            imageUrl: 'https://media.wsimag.com/attachments/97e42a0d539c4dee0ce9af4232e9125e69728244/store/fill/1860/1395/d9259c65dbfc312ed64999ecc24e40bbf09e9ddb8af0c7895b17bfb08305/Recreacion-del-personaje-de-Guy-Fawkes.jpg',
        },
        'Empresário': {
            // Dourado Luxuoso e Verde Esmeralda
            headerGradient: 'bg-gradient-to-br from-yellow-900 via-amber-700 to-amber-500',
            iconBorder: 'border-emerald-400',
            accentColor: 'text-emerald-400',
            
            // Representação: John D. Rockefeller
            imageUrl: 'https://imgcdn.stablediffusionweb.com/2024/4/15/08c2008b-d719-43d5-b1b2-86c4a41f3b45.jpg',
        },
        'Jornalista': {
            // Ciano Moderno e Cinza Papel
            headerGradient: 'bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-500',
            iconBorder: 'border-white',
            accentColor: 'text-cyan-200',
            
            // Representação: Joseph Pulitzer
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Joseph_Pulitzer_AP.jpg/500px-Joseph_Pulitzer_AP.jpg',
        },
        'Oportunista': {
            // Roxo Neon e Misterioso
            headerGradient: 'bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-600',
            iconBorder: 'border-fuchsia-400',
            accentColor: 'text-fuchsia-300',
            
            // Representação: Niccolò Maquiavel
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg/300px-Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg',
        }
    };

    // Fallback caso a role não exista
    const style = roleConfig[player.character_role] || {
        headerGradient: 'bg-gray-800',
        iconBorder: 'border-gray-500',
        accentColor: 'text-gray-400',
        imageUrl: 'https://ui-avatars.com/api/?name=' + (player.nickname || 'Unknown') + '&background=random' // Imagem genérica baseada no nome
    };

    // 2. Criar ou limpar o container do Modal
    let modalContainer = document.getElementById('player-details-modal');
    if (modalContainer) {
        modalContainer.remove();
    }
    
    modalContainer = document.createElement('div');
    modalContainer.id = 'player-details-modal';
    modalContainer.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]';
    
    const close = () => modalContainer.remove();
    modalContainer.onclick = (e) => { if(e.target === modalContainer) close(); };

    // 3. Template HTML com a Imagem Renderizada
    modalContainer.innerHTML = `
        <div class="relative w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-white/10 transition-all animate-[scaleIn_0.3s_ease-out]">
            
            <button id="btn-close-modal" class="absolute right-3 top-3 z-10 rounded-full bg-black/20 p-1 text-white/70 hover:bg-black/40 hover:text-white transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div class="${style.headerGradient} relative flex flex-col items-center pb-6 pt-8">
                <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                
                <div class="relative h-24 w-24 rounded-full border-4 ${style.iconBorder} shadow-xl ring-4 ring-white/10 overflow-hidden bg-neutral-800">
                    <img 
                        src="${style.imageUrl}" 
                        alt="${player.character_role}" 
                        class="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        onerror="this.src='https://ui-avatars.com/api/?name=?&background=333&color=fff'"
                    >
                </div>
                
                <h2 class="mt-3 text-sm font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
                    ${player.character_role}
                </h2>
            </div>

            <div class="space-y-4 bg-neutral-900 p-6">
                
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-white">${player.nickname}</h3>
                    <p class="text-xs text-neutral-500 uppercase tracking-widest mt-1">ID: ${player.user_uid.slice(0, 8)}...</p>
                </div>

                <div class="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

                <div class="grid gap-3">
                    <div class="flex items-center justify-between rounded-lg bg-neutral-800/50 border border-white/5 p-3 px-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span class="text-sm font-medium text-neutral-400">Capital</span>
                        </div>
                        <span class="text-lg font-bold text-emerald-400 font-mono tracking-tight">
                            $ ${player.capital.toLocaleString()}
                        </span>
                    </div>

                     <div class="flex items-center justify-between rounded-lg bg-neutral-800/50 border border-white/5 p-3 px-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-8 w-8 items-center justify-center rounded bg-white/5 ${style.accentColor}">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span class="text-sm font-medium text-neutral-400">Turno</span>
                        </div>
                        <span class="text-base font-bold text-white">
                            #${player.turn_order}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes scaleIn {
                0% { opacity: 0; transform: scale(0.9) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        </style>
    `;

    document.body.appendChild(modalContainer);
    document.getElementById('btn-close-modal').onclick = close;
}