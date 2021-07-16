import React, { useEffect, useState } from 'react';

import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

import { Toaster, toast } from 'react-hot-toast';

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox({ title, itens }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({itens.length})
      </h2>
      <ul>
        {/* {followers.map(({ login }) => {
          return (
            <li key={login}>
              <a href={`/users/${login}`}>
                <img src={`https://github.com/${login}.png`} />
                <span>{login}</span>
              </a>
            </li>
          );
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = 'caioharuo';
  const [communities, setCommunities] = useState([]);

  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'marcobrunodev',
    'filipedeschamps',
    'diego3g',
  ];

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/caioharuo/followers')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setFollowers(res);
      });

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: '57d5a19d6e4ff4f06182fffb3b60e3',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          title
          id
          imageUrl
          link
          creatorSlug
        }
      }`,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const communitiesFromDato = res.data.allCommunities;
        setCommunities(communitiesFromDato);
      });
  }, []);

  function handleCreateCommunity(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const community = {
      title: formData.get('title'),
      imageUrl: formData.get('image')
        ? formData.get('image')
        : `https://picsum.photos/200/300?${Math.random()}`,
      link: formData.get('link'),
      creatorSlug: githubUser,
    };

    if (!community.title || !community.link) {
      toast.error('Preencha o nome e link da comunidade!');
    } else {
      fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(community),
      }).then(async (res) => {
        const data = await res.json();

        const community = data.record;

        setCommunities([...communities, community]);
      });
    }
  }

  return (
    <>
      <Toaster />
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

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCommunity}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <div>
                <input
                  placeholder="Link para sua comunidade"
                  name="link"
                  aria-label="Link para sua comunidade"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title="Seguidores" itens={followers} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({communities.length})</h2>

            <ul>
              {communities.map((community) => {
                return (
                  <li key={community.id}>
                    <a href={community.link} target="_blank">
                      <img src={community.imageUrl} />
                      <span>{community.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoritePeople.length})
            </h2>
            <ul>
              {favoritePeople.map((githubUser) => {
                return (
                  <li key={githubUser}>
                    <a href={`/users/${githubUser}`}>
                      <img src={`https://github.com/${githubUser}.png`} />
                      <span>{githubUser}</span>
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
