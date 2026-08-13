"use client";

import { useEffect, useRef, useState } from "react";

const songs = [
  {
    title: "Munni Badnaam",
    artist: "Aishwarya Nigam & Mamta Sharma",
    videoId: "08ssSX67vWs",
  },
   {
    title: "Fevicol Se",
    artist: "Mamta Sharma | Wajid | Back Up Vocals : Keerthi Sagathia | Uvie | Shadab Faridi• Dabangg2",
    videoId: "QCc6Vo8_gKU",
  },
  {
    title: "Shanivaar Raati",
    artist: "ARIJIT SINGH, SHALMALI KHOLGADE, SAJID-WAJID& KUMAAR • MAIN TERA HERO • 2014",
    videoId: "qY66m8UosfQ",
  },
  {
    title: "DADDY MUMMY",
    artist: "DEVI SRI PRASAD (DSP), MM MANASI & KUMAAR • BHAAG JOHNNY • 2015",
    videoId: "nwidizgs-CI",
  },
   {
    title: "Pungi",
    artist: "Nakash Aziz, Mika Singh, Amitabh Bhattacharya & Pritam ",
    videoId: "n2zES3M4uwo",
  },
  {
    title: "Sadi Gali",
    artist: "Lehmber Hussainpuri",
    videoId: "HfaC9nWKrxw",
  },
  {
    title: "Nagin Dance",
    artist: "Jaidev Kumar & Anmol Malik • Bajatey Raho (Original Motion Picture Soundtrack) • 2013",
    videoId: "NvAMPqIcn-I",
  },
  {
    title: "PALAT - TERA HERO IDHAR HAI",
    artist: "ARIJIT SINGH, SAJID-WAJID, KAUSAR MUNIR & DANISH SABRI • MAIN TERA HERO • 2014",
    videoId: "t9o22bt6VU0",
  },
 
  {
    title: "Balma",
    artist: "Shreya Ghoshal & Sriram • The Second Best Exotic Marigold Hotel (Original Motion Picture Soundtrack) ",
    videoId: "3YeibEh9AXg",
  },
  {
    title: "Saturday Saturday",
    artist: "Badshah, Indeep Bakshi & Akriti Kakar • Saturday Saturday (From Humpty Sharma Ki Dulhania)",
    videoId: "GHCXVJe2re4",
  },
  
];

export default function Home() {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
const [volume, setVolume] = useState(100);
const [isMuted, setIsMuted] = useState(false);
  const currentSong = songs[currentSongIndex];
  const currentSongIndexRef = useRef(0);

  // =========================
  // YOUTUBE PLAYER
  // =========================

  useEffect(() => {
    const createPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "120",
        width: "100%",
        videoId: songs[0].videoId,

        playerVars: {
          playsinline: 1,
          controls: 1,
          rel: 0,
        },

        events: {
          onReady: () => {
            setPlayerReady(true);
          },

          onStateChange: handlePlayerState,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const script = document.createElement("script");

      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // =========================
  // PLAYER STATE
  // =========================

  const handlePlayerState = (event: any) => {
  if (!window.YT) return;

  // =========================
  // SONG PLAYING
  // =========================

  if (event.data === window.YT.PlayerState.PLAYING) {
    setIsPlaying(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;

      const current = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();

      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }, 500);
  }

  // =========================
  // SONG PAUSED
  // =========================

  if (event.data === window.YT.PlayerState.PAUSED) {
    setIsPlaying(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  // =========================
  // SONG ENDED → NEXT SONG
  // =========================

  if (event.data === window.YT.PlayerState.ENDED) {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  const currentIndex = currentSongIndexRef.current;

  const nextIndex =
    currentIndex === songs.length - 1
      ? 0
      : currentIndex + 1;

  currentSongIndexRef.current = nextIndex;

  setCurrentSongIndex(nextIndex);
  setProgress(0);

  playerRef.current.loadVideoById(
    songs[nextIndex].videoId
  );

  setIsPlaying(true);
}
};

  // =========================
  // PLAY / PAUSE
  // =========================

  const togglePlay = () => {
    if (!playerReady || !playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // =========================
  // LOAD SONG
  // =========================

  const loadSong = (index: number) => {
  if (!playerReady || !playerRef.current) return;

  const song = songs[index];

  currentSongIndexRef.current = index;
  setCurrentSongIndex(index);
  setProgress(0);

  playerRef.current.loadVideoById(song.videoId);
};

  // =========================
  // PREVIOUS
  // =========================

  const previousSong = () => {
    const newIndex =
      currentSongIndex === 0
        ? songs.length - 1
        : currentSongIndex - 1;

    loadSong(newIndex);
  };

  // =========================
  // NEXT
  // =========================

  const nextSong = () => {
    const newIndex =
      currentSongIndex === songs.length - 1
        ? 0
        : currentSongIndex + 1;

    loadSong(newIndex);
  };
  // =========================
// SEEK SONG
// =========================

const seekSong = (value: number) => {
  if (!playerReady || !playerRef.current) return;

  const duration = playerRef.current.getDuration();

  if (duration > 0) {
    const newTime = (value / 100) * duration;

    playerRef.current.seekTo(newTime, true);
    setProgress(value);
  }
};

// =========================
// VOLUME
// =========================

const changeVolume = (value: number) => {
  if (!playerReady || !playerRef.current) return;

  const newVolume = Number(value);

  playerRef.current.setVolume(newVolume);
  setVolume(newVolume);

  if (newVolume > 0) {
    playerRef.current.unMute();
    setIsMuted(false);
  }
};

// =========================
// MUTE
// =========================

const toggleMute = () => {
  if (!playerReady || !playerRef.current) return;

  if (isMuted) {
    playerRef.current.unMute();
    playerRef.current.setVolume(volume || 100);
    setIsMuted(false);
  } else {
    playerRef.current.mute();
    setIsMuted(true);
  }
};

  return (
    <main className="min-h-screen w-full bg-black">
      <div className="relative min-h-screen w-full overflow-hidden">

  {/* Background - fills screen */}
  <div
    className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-sm"
    style={{
      backgroundImage: "url('/image/image.png')",
    }}
  />

  {/* Main Image - smaller, no excessive zoom */}
  <div
    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/image/image.png')",
    }}
  />
        {/* Heading */}

      <h1 className="absolute top-40 left-1/2 w-full -translate-x-1/2 text-center font-[family-name:var(--font-hindi)] text-3xl font-semibold tracking-wide text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] md:top-20 md:text-5xl lg:text-6xl">
 Digi का अपना Zone
  <p className="mt-2 text-xl font-medium tracking-wide text-white/100 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] md:mt-4 md:text-2xl">
    अपने Office का अपना Music Radio ♪
  </p>

</h1>

        {/* Music Player */}
        {/* Floating Music Text */}
<div className="pointer-events-none absolute inset-0 overflow-hidden text-white">

  {/* Top Left */}
  <span className="absolute left-[8%] top-[18%] rotate-[-8deg] text-[14px] font-medium tracking-[0.25em] text-white/70 animate-pulse">
    ♪ CHATPATE SONGS
  </span>

  {/* Top Right */}
  <span className="absolute right-[8%] top-[24%] rotate-[7deg] text-[14px] font-medium tracking-[0.22em] text-white/70">
    MUSIC • VIBES
  </span>

  {/* Left Middle */}
  <span className="absolute left-[4%] top-[43%] rotate-[-90deg] text-[12px] tracking-[0.3em] text-white/55">
    HINDI • SONGS • NAGMA
  </span>

  {/* Right Middle */}
  <span className="absolute right-[3%] top-[48%] rotate-[90deg] text-[12px] tracking-[0.3em] text-white/55">
    NOW PLAYING ♪
  </span>

  {/* Small floating texts */}
  <span className="absolute left-[18%] top-[34%] text-[13px] font-medium text-white/60">
    ✦ सुनो ज़रा
  </span>

  <span className="absolute right-[18%] top-[38%] text-[13px] font-medium text-white/60">
    ♫ दिल से
  </span>

  <span className="absolute left-[13%] top-[57%] text-[13px] font-medium tracking-widest text-white/55">
    🎧 PLAYLIST
  </span>

  <span className="absolute right-[13%] top-[60%] text-[13px] font-medium tracking-widest text-white/55">
    ♫ GOOD MUSIC
  </span>

  {/* YouTube Music */}
  <div className="absolute right-[10%] top-[14%] flex items-center gap-2 text-[13px] font-medium text-white/65">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[11px] text-white shadow-lg">
      ▶
    </span>
    YouTube Music
  </div>

  {/* Spotify */}
  <div className="absolute left-[10%] top-[27%] flex items-center gap-2 text-[13px] font-medium text-white/65">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-[12px] font-bold text-black shadow-lg">
      ●
    </span>
    Spotify
  </div>

  {/* Decorative dots */}
  <span className="absolute left-[70%] top-[23%] text-xl text-white/50">✦</span>
  <span className="absolute right-[70%] top-[30%] text-xl text-white/50">•</span>
  <span className="absolute left-[30%] top-[52%] text-sm text-white/40">✦</span>
  <span className="absolute right-[29%] top-[54%] text-sm text-white/40">✦</span>

</div>

        <div className="absolute top-[78%] left-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2">

  <div className="rounded-2xl border border-white/20 bg-black/55 p-3 text-white shadow-2xl backdrop-blur-xl">

    {/* =========================
        MAIN PLAYER ROW
    ========================= */}

    <div className="flex items-center gap-3">

      {/* Vinyl */}

      <div
        className={`relative h-14 w-14 shrink-0 ${
          isPlaying
            ? "animate-[spin_5s_linear_infinite]"
            : ""
        }`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black shadow-lg">

          <div className="h-8 w-8 rounded-full border border-white/20 bg-zinc-800">

            <div className="mx-auto mt-2.5 h-3 w-3 rounded-full bg-white/80" />

          </div>

        </div>
      </div>


      {/* Song Info */}

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold">
          {currentSong.title}
        </p>

        <p className="mt-0.5 truncate text-xs text-white/55">
          {currentSong.artist}
        </p>

        {/* Clickable / Draggable Progress */}

        <div className="mt-2 w-full">

          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={(e) => seekSong(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
            aria-label="Song progress"
          />

        </div>

      </div>


      {/* Controls */}

      <div className="flex shrink-0 items-center gap-1">

        {/* Previous */}

        <button
          onClick={previousSong}
          disabled={!playerReady}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ⏮
        </button>


        {/* Play / Pause */}

        <button
          onClick={togglePlay}
          disabled={!playerReady}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 disabled:opacity-40"
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>


        {/* Next */}

        <button
          onClick={nextSong}
          disabled={!playerReady}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ⏭
        </button>

      </div>

    </div>


    {/* =========================
        VOLUME ROW
    ========================= */}

    <div className="mt-2 flex items-center gap-2">

      {/* Mute */}

      <button
        onClick={toggleMute}
        disabled={!playerReady}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        aria-label="Mute"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>


      {/* Volume Slider */}

      <input
        type="range"
        min="0"
        max="100"
        value={isMuted ? 0 : volume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        disabled={!playerReady}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-white disabled:opacity-40"
        aria-label="Volume"
      />


      {/* Volume Percentage */}

      <span className="w-8 text-right text-[9px] text-white/45">
        {isMuted ? 0 : volume}%
      </span>

    </div>


    {/* Hidden YouTube Player */}

    <div
      className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none"
      aria-hidden="true"
    >
      <div id="youtube-player" />
    </div>

  </div>

</div>

      </div>
    </main>
  );
}