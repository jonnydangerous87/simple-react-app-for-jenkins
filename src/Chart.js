import React from "react";
import ReactECharts from "echarts-for-react";

const Chart = ({ timestamp, measurements }) => {

  return (
    <div>
      <ReactECharts
          option={
            {
              xAxis: {
                type: 'category',
                data: timestamp
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: measurements,
                  type: 'line'
                }
              ]}}
        />
    </div>
  );
};

export default Chart;