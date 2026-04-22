import { useEffect, useMemo } from 'react'

const EMBED_SCRIPT_SRC = 'https://www.instagram.com/embed.js'

const DEFAULT_REELS = [
    'https://www.instagram.com/reel/DXD3sXFEcU6/',
    'https://www.instagram.com/reel/DVpYcjMEV0-/',
]

/** Instagram only replaces blockquotes after embed.js runs and Embeds.process() is called. */
const processEmbeds = () => {
    window.instgrm?.Embeds?.process()
}

/** Match Instagram embed URLs (fixes pasted HTML with &amp; and missing query). */
function toEmbedHref(raw) {
    let s = String(raw).trim().replace(/&amp;/g, '&')
    if (!s.includes('utm_source=ig_embed')) {
        const base = s.split('?')[0].replace(/\/?$/, '/')
        s = `${base}?utm_source=ig_embed&utm_campaign=loading`
    }
    return s
}

/**
 * @param {object} props
 * @param {string[]} [props.permalinks] — Reel/post URLs to embed (default: both store reels).
 * @param {string} [props.permalink] — Single URL; if set, only this one is shown (overrides permalinks).
 */
const Insta = ({ permalinks = DEFAULT_REELS, permalink }) => {
    const hrefs = useMemo(() => {
        if (permalink) return [toEmbedHref(permalink)]
        const list = Array.isArray(permalinks) ? permalinks : [permalinks]
        return list.map(toEmbedHref)
    }, [permalink, permalinks])

    const embedKey = hrefs.join('|')

    useEffect(() => {
        const runProcess = () => {
            processEmbeds()
            requestAnimationFrame(processEmbeds)
        }

        if (window.instgrm?.Embeds) {
            runProcess()
            return undefined
        }

        let script = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)

        const onScriptLoad = () => {
            runProcess()
        }

        if (!script) {
            script = document.createElement('script')
            script.src = EMBED_SCRIPT_SRC
            script.async = true
            script.onload = onScriptLoad
            document.body.appendChild(script)
        } else if (window.instgrm?.Embeds) {
            onScriptLoad()
        } else {
            script.addEventListener('load', onScriptLoad, { once: true })
        }

        return undefined
    }, [embedKey])

    return (
        <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-auto px-2 py-6">
            {hrefs.map((href) => (
                <blockquote
                    key={href}
                    className="instagram-media"
                    data-instgrm-captioned=""
                    data-instgrm-permalink={href}
                    data-instgrm-version="14"
                    style={{
                        background: '#FFF',
                        border: 0,
                        borderRadius: '3px',
                        boxShadow:
                            '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
                        margin: '1px',
                        maxWidth: '540px',
                        minWidth: 'min(100%, 226px)',
                        width: '100%',
                        padding: 0,
                    }}
                >
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 text-center text-sm text-slate-600 no-underline"
                    >
                        View this post on Instagram
                    </a>
                </blockquote>
            ))}
        </div>
    )
}

export default Insta
