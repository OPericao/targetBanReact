import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

import socket from './js/socket';
import supabase from './js/supabase';

import BarraInferior from './BarraInferior';
import PicksColumn from './PicksColumn';
import ColumnaCentral from './ColumnaCentral';

function App() {
  const [campeones, setCampeones] = useState([]);
  const [campeonesFiltrados, setCampeonesFiltrados] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [campeonRol, setCampeonRol] = useState([]);
  const [championPool, setChampionPool] = useState([]);

  const [selectedChampion, setSelectedChampion] = useState('');

  const [side, setSide] = useState('');
  const [blueChamps, setBlueChamps] = useState([]);
  const [redChamps, setRedChamps] = useState([]);
  const [blueFearless, setBlueFearless] = useState([]);
  const [redFearless, setRedFearless] = useState([]);
  const [blueBans, setBlueBans] = useState([]);
  const [redBans, setRedBans] = useState([]);

  const [pickingIndex, setPickingIndex] = useState('blue0');

  const [rol, setRol] = useState(0);
  const [jugador, setJugador] = useState(0);
  const [campeon, setCampeon] = useState('');

  const [draftStarted, setDraftStarted] = useState(false);

  const roomId = window.location.pathname.split('/')[2];
  const { team } = useParams();

  const [tiempoRestante, setTiempoRestante] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      const { data: campeonesData, error: err1 } = await supabase
        .from('campeones')
        .select('*')
        .order('nombre', { ascending: true });

      const { data: jugadoresData, error: err2 } = await supabase
        .from('jugadores')
        .select('*')
        .order('nombre', { ascending: true });

      const { data: campeonRolData, error: err3 } = await supabase
        .from('campeonRol')
        .select('*');

      const { data: championPoolData, error: err4 } = await supabase
        .from('championpool')
        .select('*');

      if (!err1) setCampeones(campeonesData || []);
      if (!err2) setJugadores(jugadoresData || []);
      if (!err3) setCampeonRol(campeonRolData || []);
      if (!err4) setChampionPool(championPoolData || []);
    };

    fetchData();
  }, []);

  async function crearSala() {
    const { data: existing, error: fetchError } = await supabase
      .from('historialPartidas')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Erro ao comprobar se existe a sala:", fetchError);
      return null;
    }

    if (existing) {
      const { data: partida } = await supabase
      .from('historialPartidas')
      .select('bluePicks, redPicks')
      .eq('id', existing.id)
      .single();

      const { data: data } = await supabase
      .from('historialPartidas')
      .update({
        blueFearless: partida.bluePicks,
        bluePicks: [],
        blueBans: [],
        redFearless: partida.redPicks,
        redPicks: [],
        redBans: [],
        draftFinished: false
      })
      .eq('id', existing.id)
      .select()
      .single();

      setBlueFearless(data.blueFearless);
      setRedFearless(data.redFearless);
      setBlueChamps([]);
      setRedChamps([]);
      setBlueBans([]);
      setRedBans([]);

      socket.emit('redConnect');

      return data;
    }
    else {
      const { data, error } = await supabase
        .from('historialPartidas')
        .insert([{
          id: roomId,
          bluePicks: [],
          redPicks: [],
          blueBans: [],
          redBans: [],
          draftFinished: false,
          blueFearless: [],
          redFearless: []
        }])
        .select()
        .single();

      if (error) {
        console.error("Erro creando a sala:", error);
        return null;
      }

      return data;
    }
  }

  socket.on('redConnected', () => {
    if(team == 'red'){
      window.location.reload();
    }
  });

  useEffect(() => {
    socket.emit('joinRoom', { roomId, team });

    const handleRenewInfo = ({ draftStarted, side }) => {
      setDraftStarted(draftStarted);
      setSide(side);
    };

    socket.on('renewInfo', handleRenewInfo);

    return () => {
      socket.off('renewInfo', handleRenewInfo);
    };
  }, []);

  useEffect(() => {
    const recuperarSala = async () => {
      const { data, error } = await supabase
        .from('historialPartidas')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (!error && data) {
        setBlueChamps(data.bluePicks || []);
        setRedChamps(data.redPicks || []);
        setBlueBans(data.blueBans || []);
        setRedBans(data.redBans || []);
        setBlueFearless(data.blueFearless || []);
        setRedFearless(data.redFearless || []);
      }
    };
    
    recuperarSala();
  }, [roomId]);

  const handleCampeonChange = (e) => {
    const valor = e.target.value;
    setCampeon(valor);
  };

  const handleRolChange = (valor) => {
    setRol(valor);
  };

  const handleJugadorChange = (jugadorIndex) => {
    setJugador(jugadorIndex);
  };

  const handleHoverChange = (e) => {
    if(!side.includes('ban') && side != team){
      return
    }
    socket.emit('hoverChampion', ({ champion: e.target.id, roomId }))
    setSelectedChampion(e.target.id);
  }

  useEffect(() => {
    socket.on('championHovered', ( champion ) => {
      setSelectedChampion(champion);
    });

    return () => socket.off('championHovered');
  }, []);

  useEffect(() => {
    const handleRemainingTime = (time) => {
      setTiempoRestante(time);
    };

    socket.on('remainingTime', handleRemainingTime);

    return () => {
      socket.off('remainingTime', handleRemainingTime);
    };
  }, []);

  useEffect(() => {
    if (side !== '') {
      setTiempoRestante(45);
    }
  }, [side]);

  useEffect(() => {
    const handleTurnTimeout = ({ turn, user }) => {
      setRol(0);
      setJugador(0);
      setCampeon('');
      setSelectedChampion('');

      const randomIndex = Math.floor(Math.random() * campeonesFiltrados.length);
      const randomChampion = campeonesFiltrados[randomIndex].nombre;

      if(turn.includes('ban')){
        socket.emit('banChampion', { user, champion: randomChampion, roomId });
      }
      else{
        socket.emit('pickChampion', { user, champion: randomChampion, roomId });
      }
    };

    socket.on('turnTimeout', handleTurnTimeout);

    return () => {
      socket.off('turnTimeout', handleTurnTimeout);
    };
  }, [socket, campeonesFiltrados]);

  useEffect(() => {
    const picksYBans = [
      ...blueChamps,
      ...redChamps,
      ...blueBans,
      ...redBans,
    ];

    const filtrados = filtrarCampeones().filter(c => 
      !picksYBans.includes(c.nombre)
    );

    setCampeonesFiltrados(filtrados);
  }, [rol, campeon, jugador, campeones, blueChamps, redChamps, blueBans, redBans]);

  useEffect(() => {
    const handleChampionPicked = async ({ user, champion, pickingIndex }) => {
      setSelectedChampion('');

      if (user == 'blue') {
        const newBlueChamps = [...blueChamps, champion];
        setBlueChamps(newBlueChamps);
        await supabase
          .from('historialPartidas')
          .update({
            bluePicks: newBlueChamps
          })
          .eq('id', roomId);
      } else {
        const newRedChamps = [...redChamps, champion];
        setRedChamps(newRedChamps);
        await supabase
          .from('historialPartidas')
          .update({
            redPicks: newRedChamps
          })
          .eq('id', roomId);
      }

      setCampeones(prev => prev.filter(c => c.nombre.trim().toLowerCase() != champion.trim().toLowerCase()));
      setCampeonesFiltrados(campeones);

      setPickingIndex(pickingIndex);
    };

    socket.on('championPicked', handleChampionPicked);

    return () => {
      socket.off('championPicked', handleChampionPicked);
    };
  }, [blueChamps, redChamps]);

  useEffect(() => {
    const handleChampionBanned = async ({ user, champion }) => {
      setSelectedChampion('');

      if (champion !== '') {
        if (user === 'blue') {
          await supabase
            .from('historialPartidas')
            .update({
              blueBans: [...blueBans, champion]
            })
            .eq('id', roomId);
        } else {
          await supabase
            .from('historialPartidas')
            .update({
              redBans: [...redBans, champion]
            })
            .eq('id', roomId);

        }

        setCampeones(prev => prev.filter(c => c.nombre.trim().toLowerCase() !== champion.trim().toLowerCase()));
        setCampeonesFiltrados(campeones);
      }
    };

    socket.on('championBanned', handleChampionBanned);

    return () => {
      socket.off('championBanned', handleChampionBanned);
    };
  }, [blueBans, redBans, campeones]);

  useEffect(() => {
    const channel = supabase
      .channel('room-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'historialPartidas',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const data = payload.new;
          if (!data) return;

          setBlueChamps(data.bluePicks || []);
          setRedChamps(data.redPicks || []);
          setBlueBans(data.blueBans || []);
          setRedBans(data.redBans || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    socket.on('turnChanged', (side) => {
      setSide(side);
    });

    return () => socket.off('turnChanged');
  }, []);

  useEffect(() => {
    socket.on('startDraft', async () => {
      setDraftStarted(true);
      try {
        if(team == "blue" ){
          await crearSala();
        }
      } catch (err) {
        console.error('Error al crear la sala:', err);
      }
    });

    return () => socket.off('startDraft');
  }, []);

useEffect(() => {
  socket.on('draftFinished', async () => {
    setSide('');

    const { error: updateError } = await supabase
        .from('historialPartidas')
        .update({
          draftFinished: true
        })
        .eq('id', roomId);

      if (updateError) {
        console.error("Erro actualizando a sala existente:", updateError);
        return null;
      }
  });

  return () => socket.off('draftFinished');
}, []);


function filtrarCampeones() {
  return campeones.filter(c => {
    const idCampeon = c.id;

    const matchesRol =
      rol == 0 ||
      campeonRol.some(rel => rel.id_campeon == idCampeon && rel.id_rol == rol);

    const matchesNombre =
      campeon == '' ||
      c.nombre.toLowerCase().includes(campeon.toLowerCase());

    const matchesJugador =
      jugador == 0 ||
      championPool.some(rel => rel.id_campeon == idCampeon && rel.id_jugador == jugador);

    return matchesRol && matchesNombre && matchesJugador;
  });
}


return (
  <div id="appContainer" className="d-flex flex-column min-vh-100">
    <div>
      {(side === '' && draftStarted) ? (
        <div className="alert alert-info text-center fw-bold" role="alert">
          DRAFT FINALIZADO
        </div>
      ) : !draftStarted ? (
        <div className="alert alert-info text-center fw-bold" role="alert">
          Dale al botón "Listo" para comenzar el draft
        </div>
      ) : side.includes('ban') ? (
        <div className={`alert ${ side.includes('blue') ? 'alert-primary' : 'alert-danger'} text-center fw-bold `} role="alert">
          Ban del equipo {side.replace('ban', '')} - Tiempo restante: {tiempoRestante}s
        </div>
      ) : (
        <div className={`alert ${ side.includes('blue') ? 'alert-primary' : 'alert-danger'} text-center fw-bold `} role="alert">
          Pick del equipo {side.replace('ban', '')} - Tiempo restante: {tiempoRestante}s
        </div>
      )}
    </div>

    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.5fr' }}>
      <PicksColumn
        champs={
          blueChamps.includes(selectedChampion) || side != 'blue'
            ? blueChamps
            : [...blueChamps, selectedChampion]
        }
        side={"blue"}
        pickingIndex={pickingIndex}
      />

      <ColumnaCentral
        rol={rol}
        handleRolChange={handleRolChange}
        campeon={campeon}
        handleCampeonChange={handleCampeonChange}
        jugadores={jugadores}
        handleJugadorChange={handleJugadorChange}
        campeonesFiltrados={campeonesFiltrados}
        selectedChampion={selectedChampion}
        handleHoverChange={handleHoverChange}
        canPick={draftStarted && side.replace('ban', '') != team}
      />

      <PicksColumn
        champs={
          redChamps.includes(selectedChampion) || side != 'red'
            ? redChamps
            : [...redChamps, selectedChampion]
        }
        side={"red"}
        pickingIndex={pickingIndex}
      />
    </div>

    <BarraInferior
      blueFearless={blueFearless}
      redFearless={redFearless}
      blueBans={blueBans}
      redBans={redBans}
      side={side}
      selectedChampion={selectedChampion}
      roomId={roomId}
      draftStarted={draftStarted}
      team={team}
    />
  </div>
);

}

export default App;
