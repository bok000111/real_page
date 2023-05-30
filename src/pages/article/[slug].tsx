import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { RootState } from '@/reducers';
import { useRouter } from 'next/router';

type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
};

type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
};

const ArticlePage: NextPage<{
  article: Article | null;
  comments: Comment[] | null;
}> = ({ article, comments }) => {
  if (article === null || comments === null) {
    return <div>Post not found</div>;
  }

  return (
    <div className='article-page'>
      <ArticleBanner article={article} />
      <div className='container page'>
        <ArticleContent body={article.body} />
        <hr />
        <ArticleAction article={article} />
        <CommentRow comments={comments} slug={article.slug} />
      </div>
    </div>
  );
};

function ArticleBanner({ article }: { article: Article }) {
  return (
    <div className='banner'>
      <div className='container'>
        <h1>{article.title}</h1>

        <div className='article-meta'>
          <Link href=''>
            <img src='http://i.imgur.com/Qr71crq.jpg' />
          </Link>
          <div className='info'>
            <Link href='' className='author'>
              {article?.author.username}
            </Link>
            <span className='date'>
              {new Date(article.createdAt).toDateString()}
            </span>
          </div>
          <button className='btn btn-sm btn-outline-secondary'>
            <i className='ion-plus-round'></i>
            &nbsp; Follow {article.author.username}
            {/* <span className='counter'>{article.author.following}</span> swagger에는 없는데 왜있지?*/}
          </button>
          &nbsp;&nbsp;
          <button className='btn btn-sm btn-outline-primary'>
            <i className='ion-heart'></i>
            &nbsp; Favorite Post{' '}
            <span className='counter'>({article.favoritesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleContent({ body }: { body: string }) {
  return (
    <div className='row article-content'>
      <div className='col-md-12'>
        <p>
          {body.split('\\n').reduce((acc: any[], cur) => {
            acc.push(cur);
            acc.push(' ');
            return acc;
          }, [])}
        </p>
        <br />
      </div>
    </div>
  );
}

function ArticleAction({ article }: { article: Article }) {
  return (
    <div className='article-actions'>
      <div className='article-meta'>
        <Link href='profile.html'>
          <img src='http://i.imgur.com/Qr71crq.jpg' />
        </Link>
        <div className='info'>
          <Link href='' className='author'>
            {article.author.username}
          </Link>
          <span className='date'>
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>
        <button className='btn btn-sm btn-outline-secondary'>
          <i className='ion-plus-round'></i>
          &nbsp; Follow {article.author.username}
        </button>
        &nbsp;
        <button className='btn btn-sm btn-outline-primary'>
          <i className='ion-heart'></i>
          &nbsp; Favorite Post{' '}
          <span className='counter'>({article.favoritesCount})</span>
        </button>
      </div>
    </div>
  );
}

function CommentRow({ comments, slug }: { comments: Comment[]; slug: string }) {
  return (
    <div className='row'>
      <div className='col-xs-12 col-md-8 offset-md-2'>
        <CommentForm slug={slug} />
        {comments.map((c) => {
          return <CommentComponent comment={c} key={c.id} />;
        })}
      </div>
    </div>
  );
}

function CommentForm({ slug }: { slug: string }) {
  const [commentBody, setCommentBody] = useState('Write a comment...');
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  function handleSubmit(e: React.MouseEvent) {
    if (user === undefined) return;
    e.preventDefault();
    axios.defaults.baseURL = 'https://api.realworld.io/api';
    axios.defaults.headers['Authorization'] = `Token ${user.token}`;
    axios.defaults.headers.post['Accept'] = 'application/json';
    const url = `/articles/${slug}/comments`;
    axios.post(url, { comment: { body: commentBody } }).then(() => {
      router.reload();
    });
  }
  if (user === undefined) {
    return (
      <div>
        <Link href={'/login'}>Sign in</Link> or{' '}
        <Link href={'/register'}>Sign up</Link> to add comments on this article.
      </div>
    );
  } else {
    return (
      <form className='card comment-form'>
        <div className='card-block'>
          <textarea
            className='form-control'
            placeholder={commentBody}
            onChange={(e) => {
              setCommentBody(e.target.value);
            }}
            rows={3}></textarea>
        </div>
        <div className='card-footer'>
          <img src={user.image} className='comment-author-img' />
          <button className='btn btn-sm btn-primary' onClick={handleSubmit}>
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

function CommentComponent({ comment }: { comment: Comment }) {
  return (
    <div className='card'>
      <div className='card-block'>
        <p className='card-text'>{comment.body}</p>
      </div>
      <div className='card-footer'>
        <Link href='' className='comment-author'>
          <img src={comment.author.image} className='comment-author-img' />
        </Link>
        &nbsp;
        <Link href='' className='comment-author'>
          {comment.author.username}
        </Link>
        <span className='date-posted'>{comment.createdAt}</span>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  article: Article | null;
  comments: Comment[] | null;
}> = async (context) => {
  const { params } = context;
  const slug = params?.slug;

  // slug를 사용하여 서버에서 해당 포스트 데이터 가져오기
  const articleUrl = `/articles/${slug}`;
  const commentsUrl = `/articles/${slug}/comments`;
  axios.defaults.baseURL = 'https://api.realworld.io/api';
  axios.defaults.headers.get['Accept'] = 'application/json';

  try {
    const articlePromise = axios.get(articleUrl);
    const commentPromise = axios.get(commentsUrl);
    const articleRes = await articlePromise;
    const commentRes = await commentPromise;
    if (articleRes.status === 200 && commentRes.status === 200) {
      return {
        props: {
          article: articleRes.data.article,
          comments: commentRes.data.comments,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return { props: { article: null, comments: null } };
  }
  // 데이터 가져오기에 실패한 경우
  return { props: { article: null, comments: null } };
};

export default ArticlePage;
