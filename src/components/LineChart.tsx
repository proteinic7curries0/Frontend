import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function LineChart({ data, color }: { data: number[], color: string }) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const marginLeft = 25;
    const marginRight = 10;
    const marginTop = 10;
    const marginBottom = 30;


    const chart = d3.select(chartRef.current!!)
    const rect = chartRef.current!!.getBoundingClientRect()
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft + 1, rect.width - marginRight])

    const populationMax = Math.max(...data)
    const y = d3.scaleLinear([0, populationMax], [rect.height - marginBottom - 3, marginTop])

    chart.selectAll("*").remove();
    
    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(rect.height - marginBottom - 3)
      .y1(d => y(d));

    chart
      .append("path")
      .datum(data)
      .attr("d", area)
      .attr("class", color);

    chart
      .append("g")
      .attr("transform", `translate(0, ${rect.height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(Math.min(data.length, 6)))
    chart
      .append("g")
      .attr("transform", `translate(${marginLeft - 2}, 0)`)
      .call(d3.axisLeft(y).ticks(6))
  }, [data])

  return (
    <svg ref={chartRef} className="w-full h-50"></svg>
  );
}
