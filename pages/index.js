import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import axios from 'axios';

function ProfileSidebar({ githubUser }) {
  return (
    <Box>
      <img
        src={`https://github.com/${githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
    </Box>
  );
}

export default function Home({ data }) {
  const githubUser = 'caioharuo';
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'marcobrunodev',
    'filipedeschamps',
    'diego3g',
  ];

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoritePeople.length})
            </h2>
            <ul>
              {favoritePeople.map((githubUser) => {
                return (
                  <li>
                    <a href={`/users/${githubUser}`} key={githubUser}>
                      <img src={`https://github.com/${githubUser}.png`} />
                      <span>{githubUser}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Seguidores ({data.length})</h2>
            <ul>
              {data.map(({ login }) => {
                return (
                  <li>
                    <a href={`/users/${login}`} key={data.id}>
                      <img src={`https://github.com/${login}.png`} />
                      <span>{login}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

Home.getInitialProps = async () => {
  const response = await axios.get(
    'https://api.github.com/users/caioharuo/followers'
  );

  return { data: response.data };
};
