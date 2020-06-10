import { ResponsiveLine } from '@nivo/line';
import React from 'react';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveLine = ({ data, theme /* see data tab */ }) => (
    <ResponsiveLine
        sliceTooltip={({ slice }) => {
            return (
                <div>
                    {slice.points.map((point) => (
                        <div>X Value: {point.data.x /* or `point.data.xFormatted` */}</div>
                    ))}
                </div>
            )
        }}
        theme={theme}
        data={data}
        margin={{ top: 50, right: 30, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0,  max: 'auto', stacked: true, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 0,
            tickPadding: 4,
            tickRotation: 45,
            legend: '',
            legendOffset: 32,
            legendPosition: 'start',
            tickValues: 2
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Currently Infected',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        enablePoints={false}
        enableGridX={false}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        enableCrosshair={false}

        //enableSlices='x'
        useMesh={true}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 20,
                translateY: 55,
                itemsSpacing: 2,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
                symbolShape: 'square',
               // symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
);

export default MyResponsiveLine;
