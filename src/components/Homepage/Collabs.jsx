import React from 'react';
import Slide from 'react-reveal/Fade';



const Collabs = () => {
  return (

    <section className="hero is-medium is-light is-bold">
      <div className="hero-body">
        <div className="container is-fluid is-paddingless">
          <nav className="level">
            <div className="level-item has-text-centered">
            <Slide left>
            <a href="https://www.callaghaninnovation.govt.nz/" target="_blank" rel="noopener noreferrer">
              <div>
                <figure>
                  <img src='/cal.png' alt='Callaghan Innovation'/>
                </figure>
              </div>
            </a>
            </Slide>
            </div>

            <div className="level-item has-text-centered">
            <Slide up>
            <a href="https://otago.ac.nz/" target="_blank" rel="noopener noreferrer">
              <div>
                <figure>
                  <img src='/uni_logo_horizontal.png' alt='University of Otago'/>
                </figure>
              </div>
            </a>
            </Slide>
            </div>
            <div className="level-item has-text-centered">
            <Slide right>
            <a href="https://www.mbie.govt.nz/" target="_blank" rel="noopener noreferrer">
              <div>
                <figure>
                  <img src='/mbie.png' alt='Ministry of Business Innovation and Employment'/>
                </figure>
              </div>
              </a>
            </Slide>
            </div>
          </nav>
        </div>
      </div>
    </section>


  )
}

export default Collabs
