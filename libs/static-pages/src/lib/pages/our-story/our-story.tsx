import TNMLogo from '../../../styles/images/svg/TNM_Monogram Logo_Black+No BG_RGB.svg';
import Values from '../../../styles/images/IMG_3840.jpg';
import Different from '../../../styles/images/IMG_3024.jpg';
import Ryan from '../../../styles/images/DSC02769.jpg';
import Signature from '../../../styles/images/Ryan signature.png';

export const OurStory = () => (
  <div className="our-story tnm-v1">
    <main className="main">
      <section className="page-hero">
        <div className="container">
          <div className="page-header">
            <h1>Our Story</h1>
            <p>
              From the humble beginnings of a South Manchester allotment plot,
              as a child our founder Ryan learned the fundamentals of growing
              food. Since then, we’ve been on a journey to discover the best
              local ingredients our British farmers and producers have to offer.
              Today, we proudly prepare, and hand deliver nutrition focused meal
              plans from our own specialist kitchen, to our clients across
              Greater Manchester.
            </p>
          </div>
        </div>

        <div className="line"></div>
      </section>
      <section className="our-mission">
        <div className="container">
          <div className="image-block">
            <img src={TNMLogo} alt="" className="image" />
          </div>
          <div className="text-block">
            <h2>Our Mission</h2>
            <p>
              To bridge the gap between functional 'fitness' <br />
              meal prep and the dine at home experience.
            </p>
          </div>
        </div>
      </section>
      <section className="our-values">
        <div className="container">
          <div className="image-block">
            <img src={Values} alt="" className="image" />
          </div>
          <div className="text-block">
            <h2>
              Our <span>Values</span>
            </h2>
            <p>We care about our impact on the planet.</p>

            <p>
              This is why all of our packaging is 100% recyclable and made from
              80% paper and 20% recycled plastic. We don’t go far afield for
              great ingredients and support local, family-run businesses right
              here in Manchester.{' '}
            </p>

            <p>
              {' '}
              As well as operating as a zero to landfill company, we are proud
              to source high-quality produce from British suppliers across
              Cheshire, The Lake District &amp; West Yorkshire.
            </p>
            <p></p>
          </div>
        </div>
      </section>{' '}
      <section className="makes-us-different">
        <div className="container">
          <div className="image-block">
            <img src={Different} alt="" className="image" />{' '}
          </div>
          <div className="text-block">
            <h2>What Makes Us Different?</h2>
            <p>
              From our development kitchen to your front door, we pride
              ourselves on bringing you a friendly, nutrition-led service.
              Working closely with you, we focus on the macro-nutrient profile
              of each meal which is central to a healthy, controlled diet and a
              successful fitness program.
            </p>

            <p>
              Delivering throughout Manchester and the Northwest, our clients
              enjoy delicious, restaurant quality meals developed by
              nutritionists and prepared by chefs. Our meals provide the optimal
              nutritional balance for a busy schedule and a healthy lifestyle.
            </p>
          </div>
        </div>
      </section>{' '}
      <section className="founder">
        <div className="line"></div>
        <div className="speech-marks">“</div>
        <div className="text-block">
          <h2>From our founder</h2>
          <p>
            As someone who is obsessed with good food, it seemed to me that too
            many people were missing out on the imagination, vibrancy and
            freshness needed in their functional meal prep.{' '}
          </p>
          <p></p>
          <p>
            It’s my belief that you can achieve your specific nutritional and
            fitness goals without sacrificing incredible flavours. It was out of
            this belief, that I created The Nutritionist MCR.
          </p>
        </div>
        <div className="image-block">
          <img src={Ryan} alt="" className="image" />
          <div className="banner-section"></div>
        </div>
        <img src={Signature} alt="" className="image" />{' '}
      </section>
    </main>
  </div>
);
