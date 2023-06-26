export const archiveIndexQuery = `
query getContent($endCursor: String) {
  archiveConnection(sort: "published", last: 50, before: $endCursor){
    pageInfo {
      hasPreviousPage
      endCursor
    }
    edges {
      node {
        id
        title
        cover
        published
        description
        _sys {
          filename
        }
      }
    }
  }
}
`;