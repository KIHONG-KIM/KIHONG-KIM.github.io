import { useState } from "react";
import { ResponsivePieCanvas } from "@nivo/pie";
// import tooltip from '@nivo/tooltip'
import { newMockPieData } from "../data/mockData";

const MyResponsivePieCanvas = ({ data }) => {

  return (
    <ResponsivePieCanvas
      tooltip={({ datum }) => (
        <div style={{ background: "black", color: "white", padding: "5px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                background: datum.color,
                marginRight: "10px",
              }}
            ></div>
            <strong>{datum.id}</strong>{" "}
            {datum.data.etc ? <p>({datum.data.etc.length})</p> : null} :{" "}
            <p>{datum.value.toLocaleString() + "원"}</p>
          </div>
        </div>
      )}
      data={data}
      margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
      innerRadius={0.6}
      padAngle={0.3}
      cornerRadius={4}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "paired" }}
      borderColor={{
        from: "color",
        modifiers: [["brighter", 0.6]],
      }}
      arcLinkLabelsSkipAngle={0}
      arcLinkLabelsTextColor="aquamarine"
      arcLinkLabelsThickness={3}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={0}
      arcLabelsTextColor="#555555"
      valueFormat={(value) => value.toLocaleString() + "원"}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(66, 55, 25, 1)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(222, 33, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "생활비",
          },
          id: "lines",
        },
        {
          match: {
            id: "고정지출",
          },
          id: "dots",
        },
        {
          match: {
            id: "문화생활여가",
          },
          id: "lines",
        },
        {
          match: {
            id: "교통비",
          },
          id: "dots",
        },
        {
          match: {
            id: "주거비",
          },
          id: "lines",
        },
        {
          match: {
            id: "기타",
          },
          id: "lines",
        },
        {
          match: {
            id: "미분류",
          },
          id: "lines",
        },
        {
          match: {
            id: "식비",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 140,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 60,
          itemHeight: 14,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 14,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default MyResponsivePieCanvas;
