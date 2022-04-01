export interface YearPosts {
  year: string
  posts: DateTitle[]
}

export interface DateTitle {
  id: number
  title: string
  date: Date
  day: string
  month: string
  year: string
}

export function convertToYearPosts(dateTitles: DateTitle[]): YearPosts[] {
  const years: string[] = []
  const yearPosts: YearPosts[] = []
  dateTitles.forEach((dateTitle) => {
    if (!years.includes(dateTitle.year)) {
      years.push(dateTitle.year)
      yearPosts.push({
        year: dateTitle.year,
        posts: [dateTitle],
      })
    } else {
      yearPosts.forEach((yearPost) => {
        if (yearPost.year === dateTitle.year) {
          yearPost.posts.push(dateTitle)
        }
      })
    }
  })
  return yearPosts
}

// ATTENTION: This is not a pure function. origPosts and newPosts are mutated.
export function concatYearPosts(origPosts: YearPosts[], newPosts: YearPosts[]): YearPosts[] {
  newPosts.reverse()
  while (newPosts.length > 0) {
    const tempYearPost = newPosts.pop()
    let isConcat = false
    for (const orig of origPosts) {
      if (orig.year === tempYearPost.year) {
        orig.posts = orig.posts.concat(tempYearPost.posts)
        isConcat = true
        break
      }
    }
    if (!isConcat) {
      origPosts.push(tempYearPost)
    }
  }
  return origPosts
}

export function convertToDateTitle(post: Post): DateTitle {
  const date = new Date(post.date)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return {
    id: post.id,
    date: date,
    title: post.title.rendered,
    day: day.toString(),
    month: month.toString(),
    year: year.toString(),
  }
}