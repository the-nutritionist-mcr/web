import { FC } from "react";

import { ParagraphText, Hero, Layout } from "@tnm-v5/components";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  padding: 1rem;
`;

const IndexPage: FC = () => {
  return (
    <Layout>
      <Hero>
        <h1>Hi people</h1>
      </Hero>
      <StyledDiv>
        <ParagraphText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt
          egestas sagittis. Vestibulum vel orci odio. Etiam non vestibulum
          lectus, sit amet porttitor enim. Ut ullamcorper neque nec urna
          efficitur, at mattis mi pharetra. Suspendisse risus urna, tincidunt ac
          erat sed, efficitur feugiat mi. Cras faucibus varius mollis. Donec
          ultricies molestie sodales. Cras vulputate sagittis varius. Morbi nec
          malesuada risus, lobortis venenatis elit. Etiam imperdiet vehicula
          justo, et pretium dui finibus eget.
        </ParagraphText>

        <ParagraphText>
          Praesent finibus turpis ante, vel venenatis leo finibus a. Donec
          gravida, odio sit amet consequat iaculis, risus neque iaculis urna,
          eget lobortis risus est vitae odio. Vestibulum porta dolor semper
          vulputate lacinia. Maecenas et cursus tortor. Morbi tincidunt, lorem
          sed sagittis congue, purus libero auctor erat, maximus auctor mauris
          turpis eu lacus. Nunc rutrum ut mi nec eleifend. Vestibulum sit amet
          nisl massa. In tristique eget elit eget semper. Etiam vehicula
          volutpat dolor.
        </ParagraphText>
        <ParagraphText>
          Aliquam pellentesque justo quis lacus sagittis maximus. Donec porta,
          risus vel luctus vehicula, ipsum augue imperdiet odio, vel lobortis
          sem odio vitae velit. Nulla porta, augue eu dignissim blandit, ligula
          erat faucibus ante, nec aliquam tortor quam nec ligula. Aliquam at
          posuere purus. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Nunc euismod venenatis libero, quis sodales orci tempor id.
          Praesent malesuada, ipsum fermentum suscipit interdum, magna ipsum
          convallis velit, at placerat elit ligula vel eros. Donec finibus,
          lacus id suscipit tincidunt, purus elit tempus lacus, vel scelerisque
          magna odio vel metus. Nam felis leo, varius sit amet enim vitae,
          tempor luctus nibh. Vivamus aliquam nisl ante. Aenean iaculis nulla
          ligula, vel volutpat lectus aliquam vitae. Ut ornare vitae diam sed
          fermentum. Fusce pharetra iaculis semper. Fusce fringilla augue et
          arcu gravida lacinia. Ut consectetur leo id sagittis mattis.
        </ParagraphText>
        <ParagraphText>
          Sed aliquet posuere lectus vel vehicula. Cras ut commodo eros. In
          luctus augue dui, vitae iaculis nunc mollis vel. Pellentesque habitant
          morbi tristique senectus et netus et malesuada fames ac turpis
          egestas. Praesent faucibus magna a congue porta. Mauris ut tellus
          egestas, semper nisi vel, posuere nisl. Nulla vitae felis et elit
          porttitor dignissim. Praesent fringilla velit in lacus ultrices, et
          tristique orci blandit. Etiam aliquam mollis enim, et tristique ipsum
          molestie vel. In auctor lobortis massa, lobortis sollicitudin velit
          volutpat at. Vivamus purus sapien, convallis sit amet varius non,
          tempor quis lacus. Praesent sit amet tortor a eros condimentum
          accumsan in quis arcu. Aliquam et blandit nulla. Mauris sit amet porta
          tortor. Suspendisse nec suscipit mauris.
        </ParagraphText>
      </StyledDiv>
    </Layout>
  );
};

export default IndexPage;
