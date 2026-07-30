import React from 'react';

function formatClassificationValue(val) {
  if (!val) return "";
  const match = val.match(/^([^（(]+)[（(](.+)[）)]$/);
  if (match) {
    const ch = match[1].trim();
    const en = match[2].trim();
    return (
      <>
        <span className="class-val-ch">{ch}</span>{" "}
        <span className="class-val-en">{en}</span>
      </>
    );
  }
  return <span className="class-val-ch">{val}</span>;
}

export default function ClassificationCard({ classification }) {
  const rows = [
    { label: '界', value: classification.kingdom },
    { label: '門', value: classification.phylum },
    { label: '綱', value: classification.class },
    { label: '目', value: classification.order },
    { label: '科', value: classification.family },
    { label: '屬', value: classification.genus },
    { label: '種', value: classification.species }
  ];

  return (
    <div className="detail-header-card" style={{ paddingTop: '15px' }}>
      <h4 className="detail-section-title">科學分類</h4>
      <table className="classification-table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <th>{row.label}</th>
              <td>{formatClassificationValue(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

