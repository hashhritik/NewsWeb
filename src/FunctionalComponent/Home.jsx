import React, { useState,useEffect } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home({q,language}) {
  let [totalResults, setTotalResults] = useState(0)
  let [articles, setArticles] = useState([])
  let [page, setPage] = useState(1)
  let size = 18

  async function getAPIData() {
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&pageSize=${size}& sortBy=publishedAt&language=${language}&apiKey=301c5411d2c14378ae6c68c0ff399326`
    )
    response = await response.json();
    if (response.articles) {
     setArticles(response.articles.filter((x) => x.title !== "[Removed]"))
     setTotalResults(response.totalResults)
    }
  }

  let fetchData = async () => {
    setPage(page+1)
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&pageSize=${size}&page=${page}& sortBy=publishedAt&language=${language}&apiKey=301c5411d2c14378ae6c68c0ff399326`
    )
    response = await response.json()
    if (response.articles) {
      setArticles(articles.concat(response.articles.filter((x) => x.title !== "[Removed]")))
    }
  }

  useEffect(()=>{
    getAPIData()
  },[q,language])


  return (
    <>
      <div className="container-fluid  ps-0  mt-2 ms-1">
        <h5 className="background text-center p-2 text-capitalize">
          {q} News Articles
        </h5>

        <InfiniteScroll
          dataLength={articles.length} //This is important field to render the next data
          next={fetchData}
          hasMore={articles.length < totalResults}
          loader={
            <div className="my-4 text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>}


        >


          <div className="row">
            {
              articles.map((item, index) => {
                return <NewsItem key={index}
                  source={item.source.name}
                  title={item.title}
                  description={item.description}
                  url={item.url}
                  pic={item.urlToImage}
                  date={item.publishedAt}
                />

              })}
          </div>
        </InfiniteScroll>

      </div>
    </>
  )
}


