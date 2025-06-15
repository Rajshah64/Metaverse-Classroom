//describe blocks
//What describe blocks are used for is that it groups tests together
// and it is used to describe the functionality that is being tested
// for example if you want to test authentication you can create a describe block
// and inside that describe block you can create test cases for sign up, login, logout etc.

const axios = require("axios");
const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  //it blocks
  //What it blocks are used for is that it is used to describe the test case
  // and it is used to describe the expected behavior of the code
  test("User is able to sign up only once ", async () => {
    const username = "raj shah" + Math.random();
    const password = "password123";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);
    //expect(response.data).toHaveProperty("userId");
    //OR
    expect(response.data.userId).toBeDefined();

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(updatedResponse.statusCode).toBe(400);
  });

  test("Sign up request fails if the username is empty", async () => {
    const username = "";
    const password = "password123";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(400);
    //expect(error.response.data.message).toBe("Username is required");
    //also add the above line once the backend is implemented
  });

  test("Signin successful with correct credentials", async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    //OR
    expect(response.body.token).toBeDefined();
  });

  test("Signin fails if the username and password are incorrect", async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User Metadata endpoints", () => {
  //Becauese in this section we have to sign up and sign in mandatorily
  // we will create a beforeAll block
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    //expect(response.data).toHaveProperty("userId");
    //OR
    expect(response.data.userId).toBeDefined();

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  });
  avatarId = avatarResponse.data.avatarId;

  test("User cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "wrong-avatar-id",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with the right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present ", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: "wrong-avatar-id",
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let avatarId = "";
  let token = "";
  let UserId = "";

  beforeAll(async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk/?ids=[${userId}]`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars list the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userId;
  let userToken;

  beforeAll(async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.adminId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1 = element1.id;
    element2 = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element2Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.id;
  });

  test("User is able to create a space without a mapId (empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions ", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space that doesnt exist ", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/user/space/randomIdDoesntExist`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is able to delete a space that does exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/user/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(200);
  });

  test("User should not be able to delete a space that they do not own", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/user/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(403);
  });

  test("Admin has no space initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/admin/spaces/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin can get all spaces", async () => {
    const SpaceCreateResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const response = await axios.get(`${BACKEND_URL}/api/v1/admin/spaces/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    const filteredSpaces = response.data.spaces.find((x) => x.id == spaceId);
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpaces).toBeDefined();
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userId;
  let userToken;

  beforeAll(async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    expect(userResponse.statusCode).toBe(200);
    expect(userResponse.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1 = element1.id;
    element2 = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element2Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = map.id;
    const space = await axios.post(
      `${BACKEND_URL}/api/v1/admin/spaces`,
      {
        name: "Test Space",
        dimensions: "100x200",
        mapId: "map1",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = space.spaceId;
  });

  test("Incorrect spaceId retruns a 400 ", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.dimensions).toBe("100x200");
    expect(response.data.elements).toBe(4);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceId}/element/${elementId}`,
      {
        spaceId: spaceId,
        elementId: response.data.element[0].id,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(newResponse.data.elements.length).toBe(3);
  });

  test("Adding an element works as expected", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        X: 50,
        Y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
  });

  test("Adding an element fails if it does not lie in the dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        X: 10000,
        Y: 21000000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.statusCode).toBe(404);
  });
});

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userId;
  let userToken;

  beforeAll(async () => {
    const username = `raj-${Math.random()}`;
    const password = "password123";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });

    expect(userResponse.statusCode).toBe(200);
    expect(userResponse.body.token).toBeDefined();

    //Store the token in a variable to use it in the tests
    userToken = userResponse.data.token;
  });

  test("User is not able to hit admin Endpoints", async () => {
    const elementresponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const mapresponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element2Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const updateelement = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element/123`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(mapresponse.statusCode).toBe(403);
    expect(elementresponse.statusCode).toBe(403);
    expect(updateelement.statusCode).toBe(403);
    expect(avatarResponse.statusCode).toBe(403);
  });

  test("Admin is able to hit all admin endpoints", async () => {
    const elementresponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const mapresponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element2Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(mapresponse.statusCode).toBe(200);
    expect(elementresponse.statusCode).toBe(200);
    expect(avatarResponse.statusCode).toBe(200);
  });

  test()("Admin is able to update an element", async () => {
    const elementResponse = await axios.get(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });
});

describe("Websocket tests", () => {});
