const comments = ''

export const plainBgCSS = `${comments}
.<%= prefix %>-<%= name %> {
  background-image: url(<%= cssurl %>);
}
`

export const plainItemCss = `
.<%= name %>-<%= item.meta %> {
  width: <%= item.width %>px;
  height: <%= item.height %>px;
  background-position: -<%= item.x %>px -<%= item.y %>px;
}
`

export const keyframeCSS = `
@keyframes <%= prefix %>-<%= name %> {
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: -<%= width - keyframe.width %>px 0px;
  }
}

.<%= prefix %>-<%= name %> {
  width: <%= keyframe.width %>px;
  height: <%= keyframe.height %>px;
  background-image: url(<%= cssurl %>);
  background-size: <%= width %>px <%= keyframe.vertical %>;
  animation-name: <%= prefix %>-<%= name %>;
  animation-duration: <%= keyframe.duration * items.length %>ms;
  animation-timing-function: steps(<%= items.length - 1 %>);
  animation-fill-mode: forwards;
  <% if(keyframe.infinite) { %>
  animation-iteration-count: infinite;
  <% } %>  
}
`
