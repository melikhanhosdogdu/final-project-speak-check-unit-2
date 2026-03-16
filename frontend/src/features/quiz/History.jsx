function QuizHistory({ history }) {
  return (
    <div className="quiz-history">
      <h3 className="quiz-history-title">Keyword History</h3>
      {history.length === 0 ? (
        <p className="no-history-message">No keywords yet</p>
      ) : (
        <div className="table-container">
          <table className="quiz-history-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} className="quiz-history-item">
                  <td className="history-keyword">{item.keyword}</td>
                  <td className="history-attempts">{item.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;
