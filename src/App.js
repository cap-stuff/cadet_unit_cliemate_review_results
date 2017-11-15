import React, { Component } from 'react';
import './App.css';

import questions from './data/questions.json';
import results from './data/results.json';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';

const answerMap = {
  e: {name: 'Excelent', value: 4},
  g: {name: 'Good', value: 3},
  m: {name: 'Marginal', value: 2},
  u: {name: 'Unsatisfactory', value: 1}
};
const answerMapKeys = ['e', 'g', 'm', 'u'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class AnswerSummaryTable extends Component {
  render(){
    const {
      answerDetails,
      totalAnswers
    } = this.props;

    const headers = <tr>{answerMapKeys.map(key=><th key={key}>{answerMap[key].name}</th>)}</tr>;

    const tableSummary = [<tr key="specific">{answerDetails.map(({name, count, total, percent})=>{
        return <td key={name}>{count}/{total} {percent}%</td>;
      })}</tr>];
    tableSummary.push(<tr key="grouped1">
      <td colSpan={2}>{answerDetails[0].count+answerDetails[1].count}/{totalAnswers} {((answerDetails[0].count+answerDetails[1].count)/totalAnswers*100).toFixed(2)}%</td>
      <td colSpan={2}>{answerDetails[2].count+answerDetails[3].count}/{totalAnswers} {((answerDetails[2].count+answerDetails[3].count)/totalAnswers*100).toFixed(2)}%</td>
    </tr>);
    tableSummary.push(<tr key="grouped2">
      <td>&nbsp;</td>
      <td colSpan={2}>{answerDetails[1].count+answerDetails[2].count}/{totalAnswers} {((answerDetails[1].count+answerDetails[2].count)/totalAnswers*100).toFixed(2)}%</td>
      <td>&nbsp;</td>
    </tr>);

    return (
      <div className="one-third">
        <table className="answers-summary-table">
          <thead>
            {headers}
          </thead>
          <tbody>
            {tableSummary}
          </tbody>
        </table>
      </div>
    );
  }
};

class AnswerSummaryPolar extends Component {
  render(){
    const {
      answerDetails: data
    } = this.props;
    return (
      <ResponsiveContainer width="33%" height={400} className="one-third">
        <RadarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis/>
        <Radar name="Mike" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}

const RADIAN = Math.PI / 180;
const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
    	{name[0]}
    </text>
  );
};

class AnswerSummaryPie extends Component {
  render(){
    const {
      answerDetails: data
    } = this.props;
    return (
      <ResponsiveContainer width="33%" height={400} className="one-third">
        <PieChart>
        <Pie
        isAnimationActive={false}
        dataKey="count"
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={renderCustomizedPieLabel}
        outerRadius={80}>
        {
          data.map((entry, index)=>{
            return <Cell key={index} fill={COLORS[index % COLORS.length]} />;
          })
        }
        </Pie>
        <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

class AnswerSummary extends Component {
  render(){
    const {
      answers
    } = this.props;

    const totalAnswers = answers.length;

    const answerDetails = answerMapKeys.reduce((details, key, index)=>{
      const answerInfo = answerMap[key];
      const count = answers.filter((answer)=>answer.toLowerCase()===key).length;
      const percent = ((count / totalAnswers) * 100).toFixed(2);
      return details.concat({name: answerInfo.name, count, total: totalAnswers, percent});
    }, []);

    return (
      <div>
        <AnswerSummaryTable answers={answers} answerDetails={answerDetails} totalAnswers={totalAnswers} />
        <AnswerSummaryPolar answers={answers} answerDetails={answerDetails} totalAnswers={totalAnswers} />
        <AnswerSummaryPie answers={answers} answerDetails={answerDetails} totalAnswers={totalAnswers} />
      </div>
    );
  }
}

class Question extends Component {
  render(){
    const {
      section,
      topic,
      description,
      answers
    } = this.props;

    return (
      <div>
        <h3>{section}:{topic}</h3>
        <p>{description}</p>
        <div><AnswerSummary answers={answers} /></div>
        <div className="clearfix" />
      </div>
    );
  }
};

class Questions extends Component {
  render(){
    const results = this.props.results || [];
    const questionBlocks = (this.props.questions || []).map((question, index)=>{
      const num = index + 1;
      const answers = results.map((respondent)=>respondent[num]);
      return <Question key={index} {...question} answers={answers} map={answerMap} />;
    });
    return (
      <div>
        {questionBlocks}
      </div>
    );
  }
}

class StrengthsImprovements extends Component {
  render(){
    const {
      results
    } = this.props;

    const values = results.reduce((grouped, r)=>{
      const {
        P1,
        P2,
        P3,
        N1,
        N2,
        N3
      } = r;
      [{P1}, {P2}, {P3}, {N1}, {N2}, {N3}].forEach(item=>{
        const key = Object.keys(item).shift();
        const value = item[key];
        if(value){
          const n = value.toLowerCase();
          if(!grouped[n]){
            grouped[n] = {
              type: key[0],
              value,
              count: 0
            };
          }
          grouped[n].count = grouped[n].count+1;
        }
      });
      return grouped;
    }, {});

    const grouped = Object.keys(values).reduce((grouped, key)=>{
      const item = values[key];
      grouped[item.type].push(item);
      return grouped;
    }, {P: [], N: []});

    grouped.P = grouped.P.sort((a, b)=>b.count - a.count);
    grouped.N = grouped.N.sort((a, b)=>b.count - a.count);

    const l = Math.max(grouped.P.length, grouped.N.length);

    const rows = [];
    for(let i = 0; i<l; i++){
      const p = grouped.P[i] || {};
      const n = grouped.N[i] || {};
      rows.push(
          <tr key={i}>
            <td>{p.value || ' '}</td>
            <td>{p.count || ' '}</td>
            <td>{n.value || ' '}</td>
            <td>{n.count || ' '}</td>
          </tr>
        );
    }

    return (
        <table>
          <thead>
            <tr>
              <th colSpan={2}>Strengths</th>
              <th colSpan={2}>Improvements</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Instances</th>
              <th>Name</th>
              <th>Instances</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
  }
}

class Notes extends Component {
  render(){
    const {
      results
    } = this.props;
    const notes = results.filter(r=>r.Notes && r.Notes.length).map((r, i)=><p key={i}>{r.Notes}</p>);
    return (
      <div>
        {notes}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Cadet Unit Climate Review</h1>
        <h2>Questions</h2>
          <Questions questions={questions} results={results} />
        <h2>Strengths and Improvements</h2>
          <StrengthsImprovements questions={questions} results={results} />
        <h2>Notes</h2>
          <Notes questions={questions} results={results} />
      </div>
    );
  }
}

export default App;
