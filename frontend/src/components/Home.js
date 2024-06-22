import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import SiteData from './SiteData';
import Analytics from './Analytics';

const HomeContainer = styled.div`
    display: grid;
    grid-template-columns: auto .75fr auto auto;
    gap: 10px;
    padding: 1rem;
`;

const HamburgerMenu = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 2rem;
    margin-bottom: 20px;
    user-select: none;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    &:hover {
        transform: scale(1.1);
        opacity: 0.8;
    }
`;

const SideMenu = styled.div`
    background-color: #f5f5f5;
    padding: ${props => (props.isOpen ? '15px' : '0')};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-height: ${props => (props.isOpen ? 'auto' : '0')};
    transition: max-height 0.3s ease, padding 0.3s ease;
`;

const MenuItem = styled.div`
    margin-bottom: 10px;
    cursor: pointer;
    color: #333;
    padding: 10px 0;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
    animation-delay: ${props => props.delay}s;
    transition: color 0.3s ease, font-weight 0.3s ease;

    &:hover {
        color: blue;
        font-weight: lighter;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
`;

const SectionColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const Section = styled.section`
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    h2 {
        margin-bottom: 1rem;
        color: #333;
    }

    p {
        color: #666;
    }
`;

const Footer = styled.footer`
    text-align: center;
    padding: 10px 0;
    background-color: #f5f5f5;
    color: #333;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    font-size: 14px;

    @media (max-width: 600px) {
        font-size: 12px;
        padding: 5px 0;
    }
`;

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const coreFeaturesRef = useRef(null);
    const siteDataRef = useRef(null);
    const overallAnalyticsRef = useRef(null);
    const additionalFeature1Ref = useRef(null);
    const additionalFeature2Ref = useRef(null);
    const additionalFeature3Ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            setShowFooter(bottom);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    return (
        <div>
            <HomeContainer>
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <HamburgerMenu>
                        &#9776;
                    </HamburgerMenu>
                    <SideMenu isOpen={isMenuOpen}>
                        <MenuItem delay={0.1} onClick={() => scrollToSection(coreFeaturesRef)}>Core Features</MenuItem>
                        <MenuItem delay={0.2} onClick={() => scrollToSection(siteDataRef)}>Site Data Detected</MenuItem>
                        <MenuItem delay={0.3} onClick={() => scrollToSection(overallAnalyticsRef)}>Overall Analytics</MenuItem>
                        <MenuItem delay={0.4} onClick={() => scrollToSection(additionalFeature1Ref)}>Additional Feature 1</MenuItem>
                        <MenuItem delay={0.5} onClick={() => scrollToSection(additionalFeature2Ref)}>Additional Feature 2</MenuItem>
                        <MenuItem delay={0.6} onClick={() => scrollToSection(additionalFeature3Ref)}>Additional Feature 3</MenuItem>
                    </SideMenu>
                </div>
                <SectionColumn>
                    <Section ref={coreFeaturesRef}>
                        <h2>Core Features</h2> {/*Add components to it using the ml models */}
                        <p>CatchPhis offers advanced phishing detection and site analytics.</p>
                    </Section>
                    <Section ref={siteDataRef}>
                        <h2>Site Data Detected</h2>
                        <SiteData />
                    </Section>
                    <Section ref={overallAnalyticsRef}>
                        <h2>Overall Analytics</h2>
                        <Analytics />
                    </Section>
                    <Section ref={additionalFeature1Ref}>
                        <h2>Additional Feature 1</h2>
                        <p>Description of Additional Feature 1.</p>{/*Add components to it using the ml models */}
                    </Section>
                    <Section ref={additionalFeature2Ref}>
                        <h2>Additional Feature 2</h2>
                        <p>Description of Additional Feature 2.</p>{/*Add components to it using the ml models */}
                    </Section>
                    <Section ref={additionalFeature3Ref}>
                        <h2>Additional Feature 3</h2>
                        <p>Description of Additional Feature 3.</p>{/*Add components to it using the ml models */}
                    </Section>
                </SectionColumn>
            </HomeContainer>
            {showFooter && (
                <Footer>
                    &copy; {new Date().getFullYear()} CatchPhis. All rights reserved.
                </Footer>
            )}
        </div>
    );
};

export default Home;
