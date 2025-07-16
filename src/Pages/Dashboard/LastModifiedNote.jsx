import { ResponsiveContainer } from 'recharts';
import NoteCard from '../../components/NoteCard';

function LastModifiedNote() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <div className="flex flex-col items-center justify-around">
          <text
            x="50%"
            y={20}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          >
            Last Modified Note
          </text>
          <NoteCard text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mauris risus, lobortis a neque aliquet, ornare rutrum purus. Integer hendrerit ac est non cursus. Integer quis risus tincidunt nunc mattis ultricies. Proin sed enim tellus.Lorem ipsum and some shit...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mauris risus, lobortis a neque aliquet, ornare rutrum purus. Integer hendrerit ac est non cursus. Integer quis risus tincidunt nunc mattis ultricies. Proin sed enim tellus." />
          <text>Title goes here</text>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

export default LastModifiedNote;
