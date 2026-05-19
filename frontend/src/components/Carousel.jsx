import { useState, useEffect } from 'react'
import './Carousel.css'

/**
 * Accessible, keyboard-friendly carousel with auto-advance and manual controls.
 * Renders children as slides; pass slideContent array or use children.
 */
export default function Carousel({ slideContent = [], intervalMs = 5000, children }) {
  const slides = slideContent.length > 0 ? slideContent : (Array.isArray(children) ? children : [children]).filter(Boolean)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [slides.length, intervalMs, paused])

  const goTo = (index) => setActive(Math.max(0, Math.min(index, slides.length - 1)))
  const next = () => goTo(active + 1)
  const prev = () => goTo(active - 1)

  if (slides.length === 0) return null

  return (
    <section
      className="carousel"
      aria-label="Carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel__track">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`carousel__slide ${i === active ? 'carousel__slide--active' : ''}`}
            aria-hidden={i !== active}
          >
            {typeof slide === 'object' && (
              <div className="carousel__slide-content d-flex flex-column flex-md-row align-items-center gap-4">
                {slide.image && (
                  <div className="carousel__slide-image-wrapper flex-shrink-0">
                    <img src={slide.image} alt={slide.title} className="carousel__slide-image rounded-4 shadow-lg" />
                  </div>
                )}
                <div className="carousel__slide-inner text-start">
                  <h3 className="carousel__slide-title display-6 fw-bold mb-3">{slide.title}</h3>
                  {slide.subtitle && <p className="carousel__slide-subtitle lead text-secondary mb-4">{slide.subtitle}</p>}
                  {slide.content}
                </div>
              </div>
            )}
            {typeof slide !== 'object' && slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="carousel__btn carousel__btn--prev"
            onClick={prev}
            aria-label="Previous slide"
          />
          <button
            type="button"
            className="carousel__btn carousel__btn--next"
            onClick={next}
            aria-label="Next slide"
          />
          <div className="carousel__dots" role="tablist" aria-label="Slide navigation">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}`}
                className={`carousel__dot ${i === active ? 'carousel__dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
