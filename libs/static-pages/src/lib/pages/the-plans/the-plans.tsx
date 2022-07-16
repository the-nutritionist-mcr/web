// import UltraMicro from '../../../styles/images/25_ SUMMER SALAD OF MOZZARELLA, CHARRED BROCCOLINI, ROASTED SQUASH + BASIL PESTO TOP.png';
// import Micro from '../../../styles/images14_ PAN ROASTED FILLET OF SALMON + ROASTED MEDITERRANEAN VEGETABLES TOP.png';
// import Equilibrium from '../../../styles/images/16_ SMOKEY SPANISH STYLE PAELLA TOP.png';
// import Mass from '../../../styles/images/13_ GRILLED TERIYAKI STYLE CHICKEN THIGHS + SWEET, SPICY EGG FRIED RICE TOP.png';
import HighProtein from '../../../styles/images/High_Protein.png';
import VitaminRich from '../../../styles/images/Vitamin_Rich.png';
import MacroNutrientProfiled from '../../../styles/images/Macro-Nutrient-Profiled.png';
import VegetarianAvailable from '../../../styles/images/Vegetarian-Available.png';

export const ThePlans = () => (
  <div className="the-plans tnm-v1">
    <main className="main">
      <section className="page-hero">
        <div className="page-header">
          <div className="header-text-block">
            <h1>
              We have the <span className="block">perfect plan</span>{' '}
              <span className="block">for you </span>
            </h1>
          </div>
        </div>
        <div className="page-header-right">
          <div className="dish-block"></div>
        </div>
      </section>
      <section className="meal">
        <div className="container">
          <div className="meal-plans__block">

          <div id="Ultra-Micro" className="meal-plans">
             <div className="image-block"></div>
             <div className="meal-plan-info-block">
                 <h3>Ultra Micro</h3>
                 <div className="description">Recommended for people who are looking to lose weight and stay healthy.</div>
                 <div className="kcal-info">
                     <span>350Kcal per meal</span> Macro split: 35% Protein 35% CHO 30% Fat
                 </div>
                 <div className="meal-info">
                     <div className="meal-info-image-block">
                     <img src={HighProtein} alt="" className="image" />
                     </div>
                     <div className="meal-info-image-block">
                     <img src={VitaminRich} alt="" className="image" />
                     </div>
                     <div className="meal-info-image-block">
                     <img src={MacroNutrientProfiled} alt="" className="image" />
                     </div>
                     <div className="meal-info-image-block">
                     <img src={VegetarianAvailable} alt="" className="image" />
                     </div>
                 </div>
                 <div className="price"> From <span className="from">£7.19</span> per meal </div>
                 <a href="/get-started" className="order-meal-btn">Get Started</a>
             </div>
         </div>

         <div id="Micro" className="meal-plans">
    <div className="image-block"></div>
    <div className="meal-plan-info-block">
    <h3>Micro</h3>
    <div className="description">Lighter meals for people looking to cut back a little or those who are not overly active.</div>
    <div className="kcal-info">
      <span>500Kcal per meal</span>
    Macro split: 35% Protein 35% CHO 30% Fat
    </div>
    <div className="meal-info">
              <div className="meal-info-image-block">
              <img src={HighProtein} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VitaminRich} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={MacroNutrientProfiled} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VegetarianAvailable} alt="" className="image" />
              </div>
          </div>
    <div className="price">
    From <span className="from">£7.62</span> per meal
    </div>
    <a href="/get-started" className="order-meal-btn">Get Started</a>
  </div>
  </div>

  <div id="Equilibrium" className="meal-plans">
    <div className="image-block"></div>
    <div className="meal-plan-info-block">
    <h3>Equilibrium</h3>
    <div className="description">Regular sized meals, recommended for people looking to stay consistently healthy &amp; maintain weight.</div>
    <div className="kcal-info">
      <span>650Kcal per meal</span>
   Macro split: 35% Protein 35% CHO 30% Fat
    </div>
    <div className="meal-info">
              <div className="meal-info-image-block">
              <img src={HighProtein} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VitaminRich} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={MacroNutrientProfiled} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VegetarianAvailable} alt="" className="image" />
              </div>
          </div>
    <div className="price">
    From <span className="from">£8.74</span> per meal
    </div>
    <a href="/get-started" className="order-meal-btn">Get Started</a>
  </div>
  </div>

  <div id="Mass" className="meal-plans">
    <div className="image-block"></div>
    <div className="meal-plan-info-block">
    <h3>Mass</h3>
    <div className="description">Large, nutritionally balanced meals, with extra protein for active people who are looking to gain lean muscle.</div>
    <div className="kcal-info">
    <span>800Kcal per meal</span>
    Macro split: 35% Protein 35% CHO 30% Fat
    </div>
    <div className="meal-info">
              <div className="meal-info-image-block">
              <img src={HighProtein} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VitaminRich} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={MacroNutrientProfiled} alt="" className="image" />
              </div>
              <div className="meal-info-image-block">
              <img src={VegetarianAvailable} alt="" className="image" />
              </div>
          </div>
    <div className="price">
      From <span className="from">£10.18</span> per meals
    </div>
    <a href="/get-started" className="order-meal-btn">Get Started</a>
  </div>
  </div>

          </div>
        </div>
      </section>
    </main>
  </div>
);
