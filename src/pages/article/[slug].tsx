import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  // createdAt: '2023-05-22T04:24:18.695Z';
  // updatedAt: '2023-05-22T04:24:18.695Z';
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

interface Props {
  article: Article | null;
}

const ArticlePage: NextPage<Props> = ({ article }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (!article) {
    return <div>Post not found</div>;
  }

  return (
    <div className='article-page'>
      <div className='banner'>
        <div className='container'>
          <h1>{article?.title}</h1>

          <div className='article-meta'>
            <a href=''>
              <img src='http://i.imgur.com/Qr71crq.jpg' />
            </a>
            <div className='info'>
              <a href='' className='author'>
                Eric Simons
              </a>
              <span className='date'>January 20th</span>
            </div>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-plus-round'></i>
              &nbsp; Follow Eric Simons <span className='counter'>(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className='btn btn-sm btn-outline-primary'>
              <i className='ion-heart'></i>
              &nbsp; Favorite Post <span className='counter'>(29)</span>
            </button>
          </div>
        </div>
      </div>

      <div className='container page'>
        <div className='row article-content'>
          <div className='col-md-12'>
            <p>
              Web development technologies have evolved at an incredible clip
              over the past few years.
            </p>
            <h2 id='introducing-ionic'>Introducing RealWorld.</h2>
            <p>{article?.body}</p>
          </div>
        </div>

        <hr />

        <div className='article-actions'>
          <div className='article-meta'>
            <a href='profile.html'>
              <img src='http://i.imgur.com/Qr71crq.jpg' />
            </a>
            <div className='info'>
              <a href='' className='author'>
                Eric Simons
              </a>
              <span className='date'>January 20th</span>
            </div>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-plus-round'></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className='btn btn-sm btn-outline-primary'>
              <i className='ion-heart'></i>
              &nbsp; Favorite Post <span className='counter'>(29)</span>
            </button>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12 col-md-8 offset-md-2'>
            <form className='card comment-form'>
              <div className='card-block'>
                <textarea
                  className='form-control'
                  placeholder='Write a comment...'
                  rows={3}></textarea>
              </div>
              <div className='card-footer'>
                <img
                  src='http://i.imgur.com/Qr71crq.jpg'
                  className='comment-author-img'
                />
                <button className='btn btn-sm btn-primary'>Post Comment</button>
              </div>
            </form>

            <div className='card'>
              <div className='card-block'>
                <p className='card-text'>
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className='card-footer'>
                <a href='' className='comment-author'>
                  <img
                    src='http://i.imgur.com/Qr71crq.jpg'
                    className='comment-author-img'
                  />
                </a>
                &nbsp;
                <a href='' className='comment-author'>
                  Jacob Schmidt
                </a>
                <span className='date-posted'>Dec 29th</span>
              </div>
            </div>

            <div className='card'>
              <div className='card-block'>
                <p className='card-text'>
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className='card-footer'>
                <a href='' className='comment-author'>
                  <img
                    src='http://i.imgur.com/Qr71crq.jpg'
                    className='comment-author-img'
                  />
                </a>
                &nbsp;
                <a href='' className='comment-author'>
                  Jacob Schmidt
                </a>
                <span className='date-posted'>Dec 29th</span>
                <span className='mod-options'>
                  <i className='ion-edit'></i>
                  <i className='ion-trash-a'></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  ParsedUrlQuery
> = async (context) => {
  const { params } = context;
  const slug = params?.slug;

  // slug를 사용하여 서버에서 해당 포스트 데이터 가져오기
  const url = `https://api.realworld.io/api/articles/${slug}`;
  const headers = {
    Accept: 'application/json',
  };

  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    if (res.status === 200) {
      return { props: { article: res.data.article } };
    }
  } catch (err) {
    return { props: { article: null } };
  }

  // 데이터 가져오기에 실패한 경우
  return { props: { article: null } };
};

export default ArticlePage;
