
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import YouTube from "react-youtube"
import { MdRefresh as RefreshIcon } from "react-icons/md"


export default function App({ id, title }: { id: string, title: string }) {
  const [played, setPlayed] = useState(false)
  const [videoState, setVideoState] = useState<"loading" | "success" | "error">("loading")
  const [videoObject, setVideoObject] = useState<null | object>(null)
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: false })
  const handleRefresh = () => location.reload()
  useEffect(() => {
    if (!videoObject || !played) return
    if (inView) videoObject.playVideo()
    else videoObject.pauseVideo()
  }, [inView])
  useEffect(() => {
    const x = window.screen
    setTimeout(() => console.log(x), 1000)
  }, [])
  return (
    <div
      ref={ref}
      className={`container grid place-items-center ${videoState === "success" ? "min-h-[300px]" : "min-h-[200px]"} bg-black mx-auto lg:max-w-[70%]`}
    >
      <YouTube
        videoId={id}
        title={title}
        className={`${videoState === "success" ? "block" : "hidden"} w-full h-full`}
        iframeClassName="block w-full h-full"
        onPlay={() => setPlayed(true)}
        onReady={event => {
          setVideoObject(event.target)
          setVideoState("success")
        }}
        onError={() => {
          setVideoState("error")
        }}
        opts={{
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            controls: 1,
            showinfo: 0,
          },
        }}
      />
      {videoState === "loading" && <span className="block h-[50px] border-2 border-white aspect-square border-t-transparent rounded-full animate-spin"></span>}
      {videoState === "error" && (
        <div className="flex flex-col items-center">
          <span className="text-red-500 text-xs mb-2">Failed to load video!</span>
          <button onClick={handleRefresh} className="text-white *:text-5xl">
            <RefreshIcon /></button>
          <span className="text-xs mb-2 text-white">Reload</span>
        </div>
      )}
    </div>
  )
}