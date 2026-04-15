import React from "react";
import { Grid } from "@mui/material";
import styled from "styled-components";
import InProgressIcon from "assets/InProgressIcon.svg";
import SuccessStatusIcon from "assets/SuccessStatusIcon.svg";
import CriticalIcon from "assets/CriticalIcon.svg";

interface JobSummaryData {
    successRate: number;
    total: number;
    inProgress: number;
    completed: number;
    failed: number;
}

interface JobSummaryContainerProps {
    data: JobSummaryData;
}

// Props for styled SummaryCard
interface SummaryCardProps {
    background?: string;
    borderTop?: string;
}

// Card data type
interface SummaryCardData {
    title: string;
    value: string;
    icon?: React.ReactNode;
    background?: string;
    borderTop?: string;
}

// Styled Components
const Container = styled.div`
    margin-bottom: 40px;
`;

const SummaryCard = styled.div<SummaryCardProps>`
    padding: 20px;
    background: ${(props) => props.background || "#f4f4f4"};
    border-radius: 8px;
    border-top: ${(props) => props.borderTop || "1px solid #f5f5f5"};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: none;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const CardTitle = styled.h6`
    color: #222222;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 8px 0;
    font-family: inherit;
`;

const IconContainer = styled.div`
    margin-left: 8px;
`;

const CardContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardValue = styled.h2`
    color: #333;
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    margin: 0;
    font-family: inherit;
`;

const IconImage = styled.img`
    width: 32px;
    height: 32px;
`;

const JobSummaryContainer: React.FC<JobSummaryContainerProps> = ({ data }) => {
    const summaryCards: SummaryCardData[] = [
        {
            title: "Success Rate",
            value: `${data.successRate}%`,
        },
        {
            title: "Total",
            value: data.total.toString(),
        },
        {
            title: "In Progress",
            value: data.inProgress.toString(),
            icon: <IconImage src={InProgressIcon} alt="In Progress" />,
        },
        {
            title: "Completed",
            value: data.completed.toString(),
            icon: <IconImage src={SuccessStatusIcon} alt="Success" />,
            background: "linear-gradient(180deg, rgba(71, 139, 26, 0.06) 0%, rgba(71, 139, 26, 0) 100%)",
            borderTop: "3px solid #478B1A",
        },
        {
            title: "Failed",
            value: data.failed.toString(),
            icon: <IconImage src={CriticalIcon} alt="Critical" />,
            background: "linear-gradient(180deg, rgba(237, 71, 71, 0.06) 0%, rgba(237, 71, 71, 0) 100%)",
            borderTop: "3px solid #D43136",
        },
    ];

    return (
        <Container>
            <Grid container spacing={2}>
                {summaryCards.map((card, index) => (
                    <Grid key={index} flexGrow={1}>
                        <SummaryCard background={card.background} borderTop={card.borderTop}>
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                {card.icon && <IconContainer>{card.icon}</IconContainer>}
                            </CardHeader>
                            <CardContent>
                                <CardValue>{card.value}</CardValue>
                            </CardContent>
                        </SummaryCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default JobSummaryContainer;
