import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa'; // Using Font Awesome icons

const AboutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
`;

const Section = styled.section`
    width: 100%;
    max-width: 800px; /* Adjusted max-width */
    margin: 2rem 0;
    padding: 2rem;
    background: #f8f9fa; /* Light background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Heading = styled.h2`
    text-align: center;
    margin-bottom: 1.5rem; /* Increased margin */
    color: black; /* Brand color */
`;

const SubHeading = styled.h3`
    margin-top: -0.3rem;
    margin-bottom: 0.5rem;
    color: #555; /* Darker text color */
`;

const Paragraph = styled.p`
    text-align: justify;
    margin-bottom: 1rem;
    line-height: 1.6;
`;

const FeatureList = styled.ul`
    list-style: none;
    padding: 0;
`;

const FeatureItem = styled.li`
    margin-bottom: 1.5rem; /* Increased margin */
    padding-left: 2rem; /* Added left padding for icon */
    position: relative;
    display: flex; /* Display as flex container */
    align-items: flex-start; /* Align items at the start */
    opacity: ${({ isVisible }) => (isVisible ? '1' : '0')}; /* Initial opacity */
    transform: translateY(${({ isVisible }) => (isVisible ? '0' : '20px')}); /* Initial position off-screen */
    transition: opacity 0.5s, transform 0.5s; /* Transition effect */
`;

const IconWrapper = styled.div`
    margin-right: 1rem; /* Added margin for spacing */
    color: #28a745; /* Green color for checkmark */
    flex: 0 0 auto; /* Ensure the icon doesn't grow */
`;

const About = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.innerHeight / 2;
            const element = document.querySelector('.feature');
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const scrollPosition = window.scrollY;
                setIsVisible(elementPosition - offset < scrollPosition);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial visibility on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AboutContainer>
            <Section>
                <Heading>About CatchPhis</Heading>
                <Paragraph>
                    CatchPhis is a cutting-edge browser extension designed to detect and prevent phishing attempts using advanced machine learning algorithms. Our extension helps protect users from malicious websites by analyzing site data in real-time and providing instant feedback on the safety of the sites they visit.
                </Paragraph>
                <Paragraph>
                    With the rise of phishing attacks, it's essential to have a reliable tool to safeguard your online activities. CatchPhis leverages the power of machine learning to identify patterns and signals indicative of phishing attempts, ensuring that you can browse the internet with confidence.
                </Paragraph>
            </Section>
            <Section>
                <Heading>Core Features</Heading>
                <FeatureList>
                    <FeatureItem className="feature" isVisible={isVisible}>
                        <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                        <div>
                            <SubHeading>Real-time Phishing Detection</SubHeading>
                            <Paragraph>
                                Our extension continuously monitors your browsing activity and analyzes each site you visit in real-time, detecting phishing attempts and alerting you instantly.
                            </Paragraph>
                        </div>
                    </FeatureItem>
                    <FeatureItem className="feature" isVisible={isVisible}>
                        <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                        <div>
                            <SubHeading>Comprehensive Site Analysis</SubHeading>
                            <Paragraph>
                                CatchPhis provides a thorough analysis of websites, checking for various indicators of phishing, including domain name irregularities, SSL certificate issues, and more.
                            </Paragraph>
                        </div>
                    </FeatureItem>
                    <FeatureList>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Real-time Phishing Detection</SubHeading>
                        <Paragraph>
                            Our extension continuously monitors your browsing activity and analyzes each site you visit in real-time, detecting phishing attempts and alerting you instantly.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Comprehensive Site Analysis</SubHeading>
                        <Paragraph>
                            CatchPhis provides a thorough analysis of websites, checking for various indicators of phishing, including domain name irregularities, SSL certificate issues, and more.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Instant Safety Feedback</SubHeading>
                        <Paragraph>
                            Users receive immediate feedback on the safety status of websites they visit, enabling them to avoid malicious sites and protect their personal information.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Machine Learning-Based Detection</SubHeading>
                        <Paragraph>
                            Utilizing state-of-the-art machine learning algorithms, CatchPhis identifies phishing patterns with high accuracy, adapting to new threats as they emerge.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Regular Updates to Detection Models</SubHeading>
                        <Paragraph>
                            Our machine learning models are regularly updated to ensure they remain effective against the latest phishing techniques and threats.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>User-Friendly Interface</SubHeading>
                        <Paragraph>
                            CatchPhis features an intuitive and easy-to-use interface, making it accessible to users of all technical levels.
                        </Paragraph>
                    </div>
                </FeatureItem>
                <FeatureItem className="feature" isVisible={isVisible}>
                    <IconWrapper><FaCheckCircle size={20} /></IconWrapper>
                    <div>
                        <SubHeading>Detailed Reports and Analytics</SubHeading>
                        <Paragraph>
                            Users can access detailed reports and analytics on phishing attempts, helping them understand the threats and take necessary precautions.
                        </Paragraph>
                    </div>
                </FeatureItem>
            </FeatureList>
                </FeatureList>
            </Section>
        </AboutContainer>
    );
}

export default About;
