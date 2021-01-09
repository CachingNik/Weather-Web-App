import React from 'react';
import { Line } from 'react-chartjs-2';
import '../css/graph.css';

const Lgraph = ({ title, Xaxis, label1, label2, data1, data2 }) => {

    const data = {
        labels: ['12 AM', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, '12 PM', 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, '12 AM'],
        
        datasets: [
            {
                label: label1,
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'black',
                borderColor: 'blue',
                borderWidth: 2,
                data: data1
            },
            {
                label: label2,
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'black',
                borderColor: 'green',
                borderWidth: 2,
                data: data2
            }
        ]
    };

    return (
        <div className='graph' >
            <Line data={data}
            options={{
                title:{
                  display:true,
                  text: title,
                  fontSize:20,
                  fontFamily: 'Quicksand'
                },
                legend:{
                  display:true,
                  position:'top'
                },
                scales: {
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: Xaxis,
                                fontSize: 18,
                                fontColor: 'black'
                            }
                        }
                    ]
                }
              }} />
        </div>
    );
    
}

export default Lgraph;