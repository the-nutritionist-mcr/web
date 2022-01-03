import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
const HeroBox = styled('div')(({ theme }) => {
    return {
        minHeight: '330px',
        paddingTop: `calc(${theme.menubarHeight}px + 14px)`,
        width: '100%',
        height: '330px',
        borderBottom: '1px solid black',
        fontFamily: '"Acumin Pro Semicondensed", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#d4f9e3',
    };
});
const Hero = (props) => _jsx(HeroBox, { children: props.children }, void 0);
export default Hero;
//# sourceMappingURL=hero.js.map