const MapControls = {
    // O estado fica definido aqui fora para não ser resetado
    state: {
        scale: 1,
        panning: false,
        pointX: 0,
        pointY: 0,
        startX: 0,
        startY: 0,
        cssX: 0,
        cssY: 0
    },
    
    init: () => {
        const view = document.getElementById('view-map');
        const target = document.getElementById('game-board-container');
        
        if (!view || !target) return;

        // REMOVIDO: A linha que resetava o estado (MapControls.state = { ... })
        // ADICIONADO: Aplica o estado atual (memória) ao novo elemento HTML
        MapControls.update(target);

        // Mouse Events (Desktop)
        view.onmousedown = function (e) {
            e.preventDefault();
            MapControls.state.startX = e.clientX - MapControls.state.pointX;
            MapControls.state.startY = e.clientY - MapControls.state.pointY;
            MapControls.state.panning = true;
        };

        view.onmouseup = function (e) {
            MapControls.state.panning = false;
        };

        view.onmousemove = function (e) {
            e.preventDefault();
            if (!MapControls.state.panning) return;
            MapControls.state.pointX = (e.clientX - MapControls.state.startX);
            MapControls.state.pointY = (e.clientY - MapControls.state.startY);
            MapControls.update(target);
        };

        // Touch Events (Mobile)
        let initialPinchDistance = null;
        let initialScale = 1;

        view.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                MapControls.state.panning = true;
                MapControls.state.startX = e.touches[0].clientX - MapControls.state.pointX;
                MapControls.state.startY = e.touches[0].clientY - MapControls.state.pointY;
            } else if (e.touches.length === 2) {
                MapControls.state.panning = false;
                initialPinchDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                initialScale = MapControls.state.scale;
            }
        }, { passive: false });

        view.addEventListener('touchmove', function(e) {
            e.preventDefault();
            
            if (e.touches.length === 1 && MapControls.state.panning) {
                MapControls.state.pointX = (e.touches[0].clientX - MapControls.state.startX);
                MapControls.state.pointY = (e.touches[0].clientY - MapControls.state.startY);
                MapControls.update(target);
            } else if (e.touches.length === 2 && initialPinchDistance) {
                const currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                
                const diff = currentDistance - initialPinchDistance;
                const newScale = initialScale + (diff * 0.005);
                
                MapControls.zoom(newScale);
            }
        }, { passive: false });
        
        view.addEventListener('touchend', () => {
            MapControls.state.panning = false;
            initialPinchDistance = null;
        });
    },

    zoom: (newScale) => {
        const target = document.getElementById('game-board-container');
        // Agora aceita zoom se o target existir, se não, salva no estado mesmo assim
        MapControls.state.scale = Math.min(Math.max(1, newScale), 4);
        if(target) MapControls.update(target);
    },

    zoomIn: () => MapControls.zoom(MapControls.state.scale + 0.5),
    zoomOut: () => MapControls.zoom(MapControls.state.scale - 0.5),
    
    // Botão de reset manual (para o jogador usar se quiser)
    reset: () => {
        MapControls.state.scale = 1;
        MapControls.state.pointX = 0;
        MapControls.state.pointY = 0;
        const target = document.getElementById('game-board-container');
        if(target) MapControls.update(target);
    },

    update: (target) => {
        target.style.transform = `translate(${MapControls.state.pointX}px, ${MapControls.state.pointY}px) scale(${MapControls.state.scale})`;
    }
};