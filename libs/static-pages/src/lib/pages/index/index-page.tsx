// import TnmStickerDarkGreyMint from '../../../styles/images/svg/TNM_Sticker2_DarkGrey+Mint.svg';
// import TnmBack from '../../../styles/images/svg/TNM_Icon__Back.svg';

// import CharredChick from '../../../styles/images/17_ CHARRED CHICKEN + BLACK BEAN BURRITO BOWL TOP.png';

// import HeroWebp from '../../../styles/images/Hero.jpg?webp';
// import Hero from '../../../styles/images/Hero.jpg';

// import { Image } from '@tnmw/components';
// import { dishesBlock, pageHeaderImage } from './index-page.css';

export const IndexPage = () => (
  <div className="tnm-v1 home">
    <div className="wrap container">
      {/*
      <section className={`page-hero`}>
        <div className="page-header">
          <div className="header-text-block">
            <h1>Developed by Nutritionists, Prepared by Chefs</h1>
            <div className="hero-stamp">
              <Image
                srcWebp={TnmStickerDarkGreyMint}
                srcFallback={TnmStickerDarkGreyMint}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className={`page-header-img`}>
          <Image
            className={pageHeaderImage}
            srcWebp={HeroWebp}
            srcFallback={Hero}
            alt="Charred Chicken & Black Bean Burrito Bowl"
          />
        </div>
      </section>
      <section className="intro">
        <div className="container">
          <div className="text-block">
            <h2>Freshly prepared meals, carefully hand-delivered</h2>
            <p>
              We handpick the freshest ingredients from local suppliers to
              develop new dishes, bringing you a diverse menu that reflects the
              seasons. So, you can reach your health and fitness goals without
              missing out on great taste!
            </p>
          </div>
        </div>
      </section>
      <section className="dishes">
        <div className="container">
          <div className={`dishes-block ${dishesBlock}`}></div>
          <a href="/get-started" className="dishes-btn">
            Get Started
          </a>
        </div>
      </section>
      <section className="info">
        <div className="container">
          <div className="text-block">
            <h2>What We Do</h2>
            <div className="image-block-mobile">
              <img
                src={CharredChick}
                alt="Charred Chicken + Black Bean Burrito Bowl"
              />
            </div>
            <p>
              Delivering across Greater Manchester, we bring you restaurant
              quality meals, designed by skilled chefs and qualified
              nutritionists. Delivering great taste and nutritional balance to
              compliment a busy schedule and a healthy, active lifestyle.
            </p>
            <p>
              We believe in celebrating real food, which means we only use
              whole, raw ingredients that are handpicked and prepared with care.{' '}
            </p>
            <p>Delicious, tailored meals consistently delivered.</p>
            <a href="/get-started" className="wmud-btn">
              Get Started
            </a>
          </div>
          <div
            className="image-block"
            style={{
              backgroundImage: `url(${CharredChick});`,
            }}
          ></div>
        </div>
      </section>
      <section className="why-choose-us">
        <div className="container">
          <div className="text-block">
            <h2>
              From field to fork, we’re proud to offer you a sustainable
              service.
            </h2>
            <p>
              Our chef-prepared dishes change with the seasons. We handpick
              local ingredients to support local businesses whilst keeping our
              carbon footprint to a minimum.
            </p>

            <p>
              As a zero to land-fill company, all of our packaging and waste is
              compostable or recyclable, ensuring our meals are good for you and
              the planet!
            </p>
          </div>

          <div className="reasons-block">
            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Always-Fresh.png');",
                }}
              ></div>
              <h3>
                Always <br />
                Fresh
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box left">
                  Our ingredients are sourced directly from farm and market.
                  Cooked, chilled and delivered to you the next day.
                </div>
              </div>
            </div>

            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Local-Ingredients.png)",
                }}
              ></div>
              <h3>
                Local <br />
                Ingredients
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box right">
                  Our ingredients are carefully sourced from quality, local
                  suppliers who we know and trust.
                </div>
              </div>
            </div>

            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Nutritionally-Balanced.png)",
                }}
              ></div>
              <h3>
                Nutritionally <br />
                Balanced
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box left">
                  Our in-house nutritionists are constantly developing new
                  recipes to bring you varied and nutrient packed menus.
                </div>
              </div>
            </div>

            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Macro-Nutrient-Profiled.png)",
                }}
              ></div>
              <h3>
                Macro-Nutrient <br />
                Profiled
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box right">
                  Our skilled chefs prepare simple, honest ingredients applying
                  the principles and precision of nutritional science.
                </div>
              </div>
            </div>

            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Zero-to-Landfill.png",
                }}
              ></div>
              <h3>
                Zero to <br />
                Landfill
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box right">
                  All our packaging is recyclable or re-useable and we operate a
                  no-waste policy in our kitchen.
                </div>
              </div>
            </div>

            <div className="reasons">
              <div
                className="image-block"
                style={{
                  backgroundImage:
                    "url('@php echo get_template_directory_uri() @endphp/assets/images/Vegetarian-Available.png",
                }}
              ></div>
              <h3>
                Vegetarian <br />
                Available
              </h3>
              <div className="info-toggle">
                <img src={TnmBack} alt="back" />
                <div className="info-box center">
                  We also serve fantastic calorie controlled vegetarian dishes.
                </div>
              </div>
            </div>
          </div>
          <a href="/get-started" className="wcu-btn">
            Get Started
          </a>
        </div>
      </section>
      {/*
<section className="meal-plans-order">
  <div className="container">
    <h2>Compare Plans</h2>
    <div className="meal-plans__block">
    <div className="plans">
      <div className="image-block" style="background-image: url('https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/resources/assets/images/25_ SUMMER SALAD OF MOZZARELLA, CHARRED BROCCOLINI, ROASTED SQUASH + BASIL PESTO TOP.png');">
      </div>
      <div className="content">
      <h3 className="plans-name">Ultra Micro</h3>
      <div className="description">Recommended for people who are looking to lose weight and stay healthy.</div>
      <div className="kcal-info">350kcal per meal<br>Macro split: 35% Protein 35% CHO 30% Fat</div>
      <p className="price"><span className="from">From £7.19</span> per meal</p>
      </div>
    </div>
    <div className="plans">
      <div className="image-block" style="background-image: url('https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/resources/assets/images/14_ PAN ROASTED FILLET OF SALMON + ROASTED MEDITERRANEAN VEGETABLES TOP.png');">
    </div>
    <div className="content">
      <h3 className="plans-name">Micro</h3>
      <div className="description">Lighter meals for people looking to cut back a little or those who are not overly active.</div>
      <div className="kcal-info">500kcal per meal<br>Macro split: 35% Protein 35% CHO 30% Fat</div>
      <p className="price"><span className="from">From £7.62</span> per meal</p>
    </div>
    </div>
    <div className="plans">
      <div className="image-block" style="background-image: url('https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/resources/assets/images/16_ SMOKEY SPANISH STYLE PAELLA TOP.png');">
    </div>
    <div className="content">
      <h3 className="plans-name">Equilibrium</h3>
      <div className="description">Regular sized meals, recommended for people looking to stay consistently healthy &amp; maintain weight.</div>
      <div className="kcal-info">650kcal per meal<br>Macro split: 35% Protein 35% CHO 30% Fat</div>
      <p className="price"><span className="from">From £8.74</span> per meal</p>
    </div>
    </div>
    <div className="plans">
      <div className="image-block" style="background-image: url('https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/resources/assets/images/13_ GRILLED TERIYAKI STYLE CHICKEN THIGHS + SWEET, SPICY EGG FRIED RICE TOP.png');">
    </div>
    <div className="content">
      <h3 className="plans-name">Mass</h3>
      <div className="description">Large, nutritionally balanced meals with extra protein for active people who are looking to gain lean muscle.</div>
      <div className="kcal-info">800kcal per meal<br>Macro split: 35% Protein 35% CHO 30% Fat</div>
      <p className="price"><span className="from">From £10.18</span> per meal</p>
    </div>
    </div>
    </div>
    <a href="/get-started" className="btn">Get Started</a>
  </div>
</section>

    <section className="info2">
  <div className="stamp"><img data-src="https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/dist/images/svg/TNM Stamp - Nutritionally Balanced_283317ab.svg" className="image lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img className="image" src="https://thenutritionistmcr.com/wp-content/themes/TheNutritionistMCR/dist/images/svg/TNM Stamp - Nutritionally Balanced_283317ab.svg"/></noscript></div>
  <div className="dish-block"></div>
  <div className="text-block">
  </div>
  <div className="image-block"></div>
</section>
<section className="socials">
  <div className="container">
    <div className="text-block">
  <h2>Socials</h2>
  <p>Have a look at what we’ve been up to recently.</p>
    </div>
  
<div id="sb_instagram" className="sbi sbi_mob_col_1 sbi_tab_col_2 sbi_col_4 sbi_width_resp" style="padding-bottom: 10px;width: 100%;" data-feedid="sbi_17841408232302686#4" data-res="auto" data-cols="4" data-colsmobile="1" data-colstablet="2" data-num="4" data-nummobile="" data-shortcode-atts="{&quot;num&quot;:&quot;4&quot;,&quot;cols&quot;:&quot;4&quot;}" data-postid="10" data-locatornonce="90eb5cd01e" data-sbi-flags="favorLocal,gdpr" data-sbi-index="1">
	
    <div id="sbi_images" style="padding: 5px;">
		    </div>

	<div id="sbi_load">
</div>

	    <span className="sbi_resized_image_data" data-feed-id="sbi_17841408232302686#4" data-resized="[]"></span>
	</div>

  </div>
</section>  
    </div>
  </div>
    */}
    </div>
  </div>
);
