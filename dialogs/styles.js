const formStyles = `
<style>

#control-dialog {
  height: 700px;
  overflow-y: scroll;
}

form {
  width: 400px;
}

#controls {
  margin-top: 8px;
  margin-bottom: 14px;
}

.img-wrapper {
  margin: 10px auto;
  padding: 5px;
  height: 300px;
  width: 95%;
  background-color: #bdbdbd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-width: 2px 1px 1px 2px;
  border-style: solid;
  border-color: #909090;
}

img {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

.row-wrapper {
  align-items: center;
}

.spread {
  justify-content: space-between;
}

</style>
`;

module.exports = {
  formStyles
};
