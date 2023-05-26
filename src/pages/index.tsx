import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
};

export default function Home() {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [tagMap, setTagMap] = useState(new Map<string, number>());
  useEffect(() => {
    const url = 'https://api.realworld.io/api/articles?limit=20';
    const headers = {
      Accept: 'application/json',
    };
    axios
      .get(url, {
        headers: headers,
      })
      .then((response) => {
        setArticleList(response.data.articles);
        // console.log(
        //   response.data.articles.map((a: Article) => {
        //     return a.tagList;
        //   })
        // );
        setTagMap(
          response.data.articles.reduce(
            (acc: Map<string, number>, cur: Article) => {
              cur.tagList.map((t) => {
                const tmp = acc.get(t);
                if (tmp == undefined) {
                  acc.set(t, 1);
                } else {
                  acc.set(t, tmp + 1);
                }
              });
              return acc;
            },
            new Map<string, number>()
          )
        );
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else {
        }
      });
  }, []);
  return (
    <div className='home-page'>
      <div className='container page'>
        <Banner />
        <div className='row'>
          <div className='col-md-9'>
            <FeedToggle />
            {articleList.map((a, i) => {
              return <ArticlePreview article={a} key={i} />;
            })}
          </div>

          <div className='col-md-3'>
            <div className='sidebar'>
              <p>Popular Tags</p>
              <Taglist tagMap={tagMap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className='banner'>
      <div className='container'>
        <h1 className='logo-font'>conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  );
}

function FeedToggle() {
  return (
    <div className='feed-toggle'>
      <ul className='nav nav-pills outline-active'>
        <li className='nav-item'>
          <Link className='nav-link disabled' href=''>
            Your Feed
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link active' href=''>
            Global Feed
          </Link>
        </li>
      </ul>
    </div>
  );
}

function ArticlePreview({ article }: { article: Article }) {
  return (
    <div className='article-preview'>
      <div className='article-meta'>
        <Link href={'/profile/' + article.author.username}>
          <img src={article.author.image} />
        </Link>
        <div className='info'>
          <Link href='' className='author'>
            {article.author.username}
          </Link>
          <span className='date'>January 20th</span>
        </div>
        <button className='btn btn-outline-primary btn-sm pull-xs-right'>
          <i className='ion-heart'></i> {article.favoritesCount}
        </button>
      </div>
      <Link href={'/article/' + article.slug} className='preview-link'>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}

function Taglist({ tagMap }: { tagMap: Map<string, number> }) {
  let tagList: { tag: string; count: number }[] = [];
  tagMap.forEach((val, key) => {
    tagList.push({ tag: key, count: val });
  });
  tagList.sort((a, b) => {
    return b.count - a.count;
  });
  return (
    <div className='tag-list'>
      {tagList.slice(0, 15).map((tag, i) => {
        return (
          <Link href='' className='tag-pill tag-default' key={i}>
            {tag.tag}
          </Link>
        );
      })}
    </div>
  );
}
