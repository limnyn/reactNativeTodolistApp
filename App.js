/*
  코드 챌린지

    1. (완)마지막으로 시작한 곳 기억하기( travel, work 모드를 기억하고 앱 재시작시 이어서 시작)
    2. (완)삭제가 아닌 완료 버튼과 완료 효과 구현하기 [mutate 쓰지않기]
    3. 유저가 text를 수정할 수 있게하기

    3번 알고리즘
      수정 버튼을 누르면
      텍스트를 
    
    완료, 수정, 삭제 버튼 및 기능 구현
    버튼추가완료
    함수작성중
*/
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";
const STORAGE_KEY = "@toDos";
const STATUS_KEY = "@isWorking";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [checkBox, setCheckBox] = useState(false);
  useEffect(() => {
    loadStatus();
    loadToDos();
  }, []);
  useEffect(() => {
    saveStatus(working);
  }, [working]);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveStatus = async (iswork) => {
    await AsyncStorage.setItem(STATUS_KEY, iswork.toString());
  };
  const loadStatus = async () => {
    const s = await AsyncStorage.getItem(STATUS_KEY);
    if (s) {
      setWorking(JSON.parse(s));
    } else {
      setWorking(true);
    }
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    //save to do
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, checkBox },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteTodo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Delete To do?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do?", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
    return;
  };
  const checkTodo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].checkBox = !newToDos[key].checkBox;
    setToDos(newToDos);
    setCheckBox(!checkBox);
    await saveToDos(newToDos);
    console.log(newToDos[key].checkBox);
    return;
  };
  const modifyTodo = async (key) => {};

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0} onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={addToDo}
        value={text}
        onChangeText={onChangeText}
        placeholder={working ? "Add a To Do" : "Where do you want to go"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text
                style={
                  toDos[key].checkBox ? styles.toDoText : styles.toDoTextChecked
                }
              >
                {toDos[key].text}
              </Text>
              <Text style={styles.toDoIcon}>
                <TouchableOpacity onPress={() => checkTodo(key)}>
                  {toDos[key].checkBox ? (
                    <Fontisto
                      name="checkbox-passive"
                      size={20}
                      color={theme.grey}
                    />
                  ) : (
                    <Fontisto
                      name="checkbox-active"
                      size={20}
                      color={theme.grey}
                    />
                  )}
                </TouchableOpacity>
                {"    "}
                <TouchableOpacity onPress={() => modifyTodo(key)}>
                  <Fontisto name="scissors" size={20} color={theme.grey} />
                </TouchableOpacity>
                {"    "}
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={20} color={theme.grey} />
                </TouchableOpacity>
              </Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toDoTextChecked: {
    color: "grey",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  toDoIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
