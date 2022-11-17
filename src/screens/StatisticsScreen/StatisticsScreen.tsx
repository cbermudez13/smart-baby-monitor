/*import React from 'react';

import {
  Canvas,
  Line,
  Path,
  runTiming,
  Skia,
  SkPath,
  useComputedValue,
  useValue,
  vec,
  useFont
} from '@shopify/react-native-skia';

import {Text as SkiaText} from '@shopify/react-native-skia';

import {animatedData, animatedData2, DataPoint, originalData} from './Data';
import {curveBasis, line, scaleLinear, scaleTime,scalePoint} from 'd3';
import {Easing, View, Pressable, Text, StyleSheet} from 'react-native';


const Header = () => {

  return(
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Statistics</Text>
  </View>
);
}

interface DataPoint2 {
  label: string;
  value: number;
}

const data: DataPoint2[] = [
  {label: 'Monday', value: 0},
  {label: 'Tuesday', value: 50},
  {label: 'Wednesday', value: 100},
  {label: 'Thursday', value: 150},
];


const bpmData: DataPoint2[] = [
  {label: 'Monday', value: 50},
  {label: 'Tuesday', value: 100},
  {label: 'Wednesday', value: 65},
  {label: 'Thursday', value: 75},
  {label: 'Friday', value: 55},
  {label: 'Saturday', value: 80},
  {label: 'Sunday', value: 78},
];
const bodyTempData: DataPoint2[] = [
  {label: 'Monday', value: 97},
  {label: 'Tuesday', value: 98},
  {label: 'Wednesday', value: 100},
  {label: 'Thursday', value: 96},
  {label: 'Friday', value: 96},
  {label: 'Saturday', value: 97},
  {label: 'Sunday', value: 99},
];
const roomTempData: DataPoint2[] = [
  {label: 'Monday', value: 78},
  {label: 'Tuesday', value: 65},
  {label: 'Wednesday', value: 85},
  {label: 'Thursday', value: 84},
  {label: 'Friday', value: 60},
  {label: 'Saturday', value: 70},
  {label: 'Sunday', value: 73},
];

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}

const StatisticsScreen = () => {
  const font = useFont(require('./Roboto-Bold.ttf'), 10);
  const transition = useValue(1);
  const state = useValue({
    current: 0,
    next: 1,
  });

  const GRAPH_HEIGHT = 350;
  const GRAPH_WIDTH = 410;

  const xDomain = bpmData.map((dataPoint: DataPoint2) => dataPoint.label);
  const xRange = [0, GRAPH_WIDTH];
  const x = scalePoint().domain(xDomain).range(xRange).padding(1);

  const makeGraph = (data: DataPoint2[]): GraphData => {
    const max = Math.max(...data.map(val => val.value));
    const min = Math.min(...data.map(val => val.value));
    const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

   // const x = scaleTime().domain([new Date(2000, 1, 1), new Date(2000, 1, 15)]).range([10, GRAPH_WIDTH - 10]);


      const xDomain = data.map((dataPoint: DataPoint2) => dataPoint.label);
      const xRange = [0, GRAPH_WIDTH];
      const x = scalePoint().domain(xDomain).range(xRange).padding(1);

    const curvedLine = line<DataPoint2>()
      .x(d => x(d.label))
      .y(d => y(d.value))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
    
    return {
      max,
      min,
      curve: skPath!
    };
  };

  const transitionStart = (end: number) => {
    state.current = {
      current: end,
      next: state.current.current,
    };
    transition.current = 0;
    runTiming(transition, 1, {
      duration: 750,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const graphData = [makeGraph(bpmData), makeGraph(bodyTempData), makeGraph(roomTempData)];

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve;
    const end = graphData[state.current.next].curve;
    const result = start.interpolate(end, transition.current);
    return result?.toSVGString() ?? '0';
  }, [state, transition]);
  if (!font) {
    return <View />;
  }
  return (
    <View style={monitorStyle.container}>
      <Header/>
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
        }}>
        <Line
          p1={vec(10, 130)}
          p2={vec(400, 130)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 250)}
          p2={vec(400, 250)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 370)}
          p2={vec(400, 370)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Path style="stroke" path={path} strokeWidth={4} color='#c461f2'/>
        {bpmData.map((dataPoint: DataPoint2) => (
          <SkiaText
            key={dataPoint.label}
            font={font}
            x={x(dataPoint.label)}
            y={GRAPH_HEIGHT-15}
            text={dataPoint.label}
          />
          
          ))}
          {data.map((dataPoint: DataPoint2) => (
          <SkiaText
            key={dataPoint.value}
            font={font}
            x={0}
            y={dataPoint.value+100}
            text={dataPoint.value.toString()}
          />
          
          ))}
          
      </Canvas>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => transitionStart(0)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Average Heart Rate</Text>
        </Pressable>
        <Pressable
          onPress={() => transitionStart(1)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Average Body Temperature</Text>
        </Pressable>
        <Pressable
          onPress={() => transitionStart(2)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Average Room Temperature</Text>
        </Pressable>
      </View>
    </View>
  );
};

const monitorStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#efd7fc',
  },
  headerContainer: {
    backgroundColor: '#efd7fc',
    bottom: 0
  },
  headerTitle: {
    color: '#da9afc',
    fontSize: 30,
    fontWeight: '700',
    paddingVertical: 16,
    textAlign: 'center',
  },
  infantContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infantHeading: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: '700',
    height: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonText: {
    color: '#ffe6f7',
    fontWeight: '800',
    padding: 50,
    fontSize: 35,
    textAlign: 'center',
    bottom: -30,


  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#da9afc',
    width: 250,
    height: 250,
    borderRadius: 200,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 300,
    elevation: 5,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 150,
    backgroundColor: '#efd7fc',
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  buttonStyle: {
    marginBottom: 15,
    backgroundColor: '#c461f2',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default StatisticsScreen;*/
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import {Easing, View, Pressable, Text, StyleSheet} from 'react-native';

const Header = () => {

  return(
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Statistics</Text>
  </View>
);
}


const StatisticsScreen = () => {
  const max = 45;
  const min = 110;
  function getRandomIntInclusive(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
  return (

    <View style={monitorStyle.container}>
      <Header/>
      <Text>Daily Average Heart Rate</Text>
      <LineChart
        data={{
          labels: ["11/17", "11/18", "11/19", "11/20", "11/21", "11/22","11/23"],
          datasets: [
            {
              data: [
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max),
                getRandomIntInclusive(min,max)
              ]
            }
          ]
        }}
        fromZero={true}
        width={400} // from react-native
        height={300}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#db7efc",
          backgroundGradientFrom: "#db7efc",
          backgroundGradientTo: "#db7efc",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#db7efc"
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
        
      }}
      />
      <Text>{'\n'}Daily Average Body Temperature</Text>
      <LineChart
        data={{
          labels: ["11/17", "11/18", "11/19", "11/20", "11/21", "11/22","11/23"],
          datasets: [
            {
              data: [
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102),
                getRandomIntInclusive(95,102)
              ]
            }
          ]
        }}
        fromZero={true}
        width={400} // from react-native
        height={300}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#db7efc",
          backgroundGradientFrom: "#db7efc",
          backgroundGradientTo: "#db7efc",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#db7efc"
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
        
      }}
      />
    </View>
  );
};

const monitorStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#efd7fc',
  },
  headerContainer: {
    backgroundColor: '#efd7fc',
    bottom: 0
  },
  headerTitle: {
    color: '#da9afc',
    fontSize: 30,
    fontWeight: '700',
    paddingVertical: 16,
    textAlign: 'center',
  },
  infantContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infantHeading: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: '700',
    height: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonText: {
    color: '#ffe6f7',
    fontWeight: '800',
    padding: 50,
    fontSize: 35,
    textAlign: 'center',
    bottom: -30,


  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#da9afc',
    width: 250,
    height: 250,
    borderRadius: 200,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 300,
    elevation: 5,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default StatisticsScreen


