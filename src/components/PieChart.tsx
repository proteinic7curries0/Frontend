import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function PieChart({ data, colors }: { data: number[], colors: string[] }) {
    const chartRef = useRef<SVGSVGElement | null>(null);
    const [hoverData, setHoverData] = useState<{ x: number, y: number, hoverRangeTitle: string, count: number } | null>(null)

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const rect = chartRef.current!.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;
        const radius = Math.min(width, height) / 2 - 10;

        const buckets = [
            data.filter(v => v >= 0 && v < 25).length,
            data.filter(v => v >= 25 && v < 50).length,
            data.filter(v => v >= 50 && v < 75).length,
            data.filter(v => v >= 75 && v <= 100).length,
        ];

        const pie = d3
            .pie<number>()
            .sort(null)
            .value(d => d);

        const arc = d3
            .arc<d3.PieArcDatum<number>>()
            .innerRadius(0)
            .outerRadius(radius);

        const group = svg
            .append("g")
            .attr(
                "transform",
                `translate(${width / 2}, ${height / 2})`
            );

        group
            .selectAll("path")
            .data(pie(buckets))
            .join("path")
            .attr("d", arc)
            .attr("class", (_, i) => colors[i])
            .on("mousemove", (event, d) => {
                let [y, x] = d3.pointer(event, chartRef.current!!);
                let hoverRangeTitle: string
                let count: number
                if (hoverData) {
                    hoverRangeTitle = hoverData.hoverRangeTitle
                    count = hoverData.count
                } else {
                    hoverRangeTitle = ["0-25", "25-50", "50-75", "75-100"][d.index]
                    count = buckets[d.index]
                }
                setHoverData({ x, y, hoverRangeTitle, count })
            })
            .on("mouseout", (_) => {
                setHoverData(null)
            })
    }, [data, colors]);

    return (
        <div>
            <div className="absolute">
                {hoverData && (
                    <div className="relative bg-black px-2 py-1 border border-white" style={{ top: hoverData.x - 60, left: hoverData.y + 10 }}>
                        <h1>{hoverData.hoverRangeTitle}</h1>
                        <h2>Count: {hoverData.count}</h2>
                    </div>
                )}

            </div>
            <svg
                ref={chartRef}
                className="w-50 h-50">
            </svg>

        </div>
    );
}