"use client";
import { songs } from "@/components/music/Song";
import { useEffect, useRef, useState } from "react";

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
   
  <main className="min-h-screen w-full overflow-hidden bg-black">
    <div className="relative h-screen w-screen overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div
        className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url('/image/image.png')",
        }}
      />

      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/image/image.png')",
        }}
      />

      {/* ================= HEADING ================= */}

      <div className="absolute left-1/2 top-[12%] z-20 w-[90%] -translate-x-1/2 text-center sm:top-[14%] md:top-[8%]">
        <h1 className="font-[family-name:var(--font-hindi)] text-3xl font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl lg:text-6xl">
          Digi का अपना Zone
        </h1>

        <p className="mt-2 font-[family-name:var(--font-hindi)] text-sm font-medium tracking-wide text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-base md:mt-3 md:text-xl lg:text-2xl">
          अपने Office का अपना Music Radio ♪
        </p>
      </div>

      {/* ================= FLOATING MUSIC TEXT ================= */}

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden text-white">

        {/* Chatpate Songs */}
        <span className="absolute left-[4%] top-[24%] rotate-[-8deg] text-[8px] font-medium tracking-[0.15em] text-white/65 sm:left-[8%] sm:top-[20%] sm:text-[11px] md:text-[14px]">
          ♪ CHATPATE SONGS
        </span>

        {/* Music Vibes */}
        <span className="absolute right-[4%] top-[29%] rotate-[7deg] text-[8px] font-medium tracking-[0.15em] text-white/65 sm:right-[8%] sm:top-[25%] sm:text-[11px] md:text-[14px]">
          MUSIC • VIBES
        </span>

        {/* YouTube Music */}
        <div className="absolute right-[5%] top-[18%] flex items-center gap-1 text-[7px] font-medium text-white/65 sm:right-[10%] sm:top-[15%] sm:gap-2 sm:text-[10px] md:text-[13px]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[6px] text-white shadow-lg sm:h-5 sm:w-5 sm:text-[7px]">
            ▶
          </span>
          YouTube Music
        </div>

        {/* Spotify */}
        <div className="absolute left-[5%] top-[32%] flex items-center gap-1 text-[7px] font-medium text-white/65 sm:left-[10%] sm:top-[29%] sm:gap-2 sm:text-[10px] md:text-[13px]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[6px] font-bold text-black shadow-lg sm:h-5 sm:w-5 sm:text-[7px]">
            ●
          </span>
          Spotify
        </div>

        {/* Hindi Text */}
        <span className="absolute left-[9%] top-[42%] text-[10px] font-medium text-white/60 sm:left-[18%] sm:top-[37%] sm:text-[12px] md:text-[13px]">
          ✦ सुनो ज़रा
        </span>

        <span className="absolute right-[9%] top-[45%] text-[10px] font-medium text-white/60 sm:right-[18%] sm:top-[40%] sm:text-[12px] md:text-[13px]">
          ♫ दिल से
        </span>

        {/* Side Text */}
        <span className="absolute left-[-17px] top-[48%] rotate-[-90deg] text-[8px] tracking-[0.25em] text-white/45 sm:left-[-5px] sm:text-[10px] md:text-[12px]">
          HINDI • SONGS • NAGMA
        </span>

        <span className="absolute right-[-18px] top-[52%] rotate-[90deg] text-[8px] tracking-[0.25em] text-white/45 sm:right-[-6px] sm:text-[10px] md:text-[12px]">
          NOW PLAYING ♪
        </span>

        {/* Playlist */}
        <span className="absolute bottom-[28%] left-[7%] text-[8px] font-medium tracking-widest text-white/50 sm:left-[13%] sm:bottom-[25%] sm:text-[11px] md:text-[13px]">
          🎧 PLAYLIST
        </span>

        <span className="absolute bottom-[27%] right-[7%] text-[8px] font-medium tracking-widest text-white/50 sm:right-[13%] sm:text-[11px] md:text-[13px]">
          ♫ GOOD MUSIC
        </span>

        {/* Decorative */}
        <span className="absolute left-[25%] top-[31%] text-sm text-white/40 md:text-xl">
          ✦
        </span>

        <span className="absolute right-[25%] top-[35%] text-sm text-white/40 md:text-xl">
          •
        </span>

        <span className="absolute left-[30%] top-[55%] text-xs text-white/35 md:text-sm">
          ✦
        </span>

        <span className="absolute right-[30%] top-[57%] text-xs text-white/35 md:text-sm">
          ✦
        </span>
      </div>

      {/* ================= MUSIC PLAYER ================= */}

      <div className="absolute bottom-[3%] left-1/2 z-30 w-[94%] max-w-md -translate-x-1/2 sm:bottom-[4%] md:bottom-[8%]">

        <div className="rounded-2xl border border-white/20 bg-black/60 p-3 text-white shadow-2xl backdrop-blur-xl sm:p-4">

          {/* MAIN ROW */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Vinyl */}

            <div
              className={`relative h-11 w-11 shrink-0 sm:h-14 sm:w-14 ${
                isPlaying
                  ? "animate-[spin_5s_linear_infinite]"
                  : ""
              }`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black shadow-lg">

                <div className="h-6 w-6 rounded-full border border-white/20 bg-zinc-800 sm:h-8 sm:w-8">

                  <div className="mx-auto mt-2 h-2.5 w-2.5 rounded-full bg-white/80 sm:mt-2.5 sm:h-3 sm:w-3" />

                </div>

              </div>
            </div>

            {/* SONG INFO */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-semibold sm:text-sm">
                {currentSong.title}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-white/55 sm:text-xs">
                {currentSong.artist}
              </p>

              {/* Progress */}

              <div className="mt-1.5 w-full sm:mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={(e) =>
                    seekSong(Number(e.target.value))
                  }
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
                  aria-label="Song progress"
                />
              </div>

            </div>

            {/* CONTROLS */}

            <div className="flex shrink-0 items-center gap-0 sm:gap-1">

              <button
                onClick={previousSong}
                disabled={!playerReady}
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40 sm:h-8 sm:w-8"
              >
                ⏮
              </button>

              <button
                onClick={togglePlay}
                disabled={!playerReady}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs text-black shadow-lg transition hover:scale-105 disabled:opacity-40 sm:h-10 sm:w-10"
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

              <button
                onClick={nextSong}
                disabled={!playerReady}
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40 sm:h-8 sm:w-8"
              >
                ⏭
              </button>

            </div>
          </div>

          {/* VOLUME */}

          <div className="mt-2 flex items-center gap-2 sm:mt-3">

            <button
              onClick={toggleMute}
              disabled={!playerReady}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              aria-label="Mute"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) =>
                changeVolume(Number(e.target.value))
              }
              disabled={!playerReady}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-white disabled:opacity-40"
              aria-label="Volume"
            />

            <span className="w-7 text-right text-[8px] text-white/45 sm:w-8 sm:text-[9px]">
              {isMuted ? 0 : volume}%
            </span>

          </div>

          {/* YOUTUBE PLAYER */}

          <div
            className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
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