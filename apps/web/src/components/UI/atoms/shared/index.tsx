import styled, { css } from "styled-components";
import React from "react";

interface IFlex {
  direction: React.CSSProperties["flexDirection"];
  justifyContent: React.CSSProperties["justifyContent"];
  alignItems: React.CSSProperties["alignItems"];
  flex: React.CSSProperties["flex"];
  flexWrap: React.CSSProperties["flexWrap"];
  gap: number;
}

export const Flex = styled.div<Partial<IFlex>>`
  display: flex;
  flex-direction: ${(p) => p.direction};
  justify-content: ${(p) => p.justifyContent};
  align-items: ${(p) => p.alignItems};
  gap: ${(p) => p.gap}rem;
  flex-wrap: ${(p) => p.flexWrap};
  flex: ${(p) => p.flex};
`;

export const ellipsis = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
